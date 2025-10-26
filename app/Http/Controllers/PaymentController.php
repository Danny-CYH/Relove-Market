<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductOptionValue;
use App\Models\Order;
use App\Models\OrderItem; // Make sure you have this model
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;

use App\Events\SellerPage\NewOrderCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function validateStock(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_items' => 'required|array|min:1',
                'order_items.*.product_id' => 'required|string',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.selected_variant' => 'sometimes|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'valid' => false,
                    'error' => $validator->errors()->first()
                ], 400);
            }

            DB::beginTransaction();

            foreach ($request->order_items as $item) {
                $productId = $item['product_id'];
                $quantity = $item['quantity'];
                $selectedVariant = $item['selected_variant'] ?? null;
                $selectedOptions = $item['selected_options'] ?? null;

                // Create a unique lock key for this product/variant
                $lockKey = "stock_check_{$productId}";
                if ($selectedVariant && isset($selectedVariant['variant_id'])) {
                    $lockKey .= "_{$selectedVariant['variant_id']}";
                }

                // Use database lock for stock validation
                if ($selectedVariant && isset($selectedVariant['variant_id'])) {
                    // Check variant stock
                    $variant = ProductVariant::where('variant_id', $selectedVariant['variant_id'])
                        ->lockForUpdate()
                        ->first();

                    if (!$variant) {
                        DB::rollBack();
                        return response()->json([
                            'valid' => false,
                            'error' => "Variant not found for product {$productId}"
                        ], 404);
                    }

                    if ($variant->quantity < $quantity) {
                        DB::rollBack();
                        return response()->json([
                            'valid' => false,
                            'error' => "Not enough stock for selected variant. Available: {$variant->quantity}, Requested: {$quantity}"
                        ], 400);
                    }
                } elseif ($selectedOptions) {
                    // Check option-based stock (backward compatibility)
                    foreach ($selectedOptions as $optionName => $optionData) {
                        $valueId = $optionData['value_id'] ?? null;

                        if ($valueId) {
                            $optionValue = ProductOptionValue::where('value_id', $valueId)
                                ->lockForUpdate()
                                ->first();

                            if (!$optionValue) {
                                DB::rollBack();
                                return response()->json([
                                    'valid' => false,
                                    'error' => "Option value not found for {$valueId}"
                                ], 404);
                            }

                            if ($optionValue->quantity < $quantity) {
                                DB::rollBack();
                                return response()->json([
                                    'valid' => false,
                                    'error' => "Not enough stock for {$optionName}. Available: {$optionValue->quantity}, Requested: {$quantity}"
                                ], 400);
                            }
                        }
                    }
                } else {
                    // Check main product stock
                    $product = Product::where('product_id', $productId)
                        ->lockForUpdate()
                        ->first();

                    if (!$product) {
                        DB::rollBack();
                        return response()->json([
                            'valid' => false,
                            'error' => "Product not found: {$productId}"
                        ], 404);
                    }

                    if ($product->product_quantity < $quantity) {
                        DB::rollBack();
                        return response()->json([
                            'valid' => false,
                            'error' => "Not enough stock for product. Available: {$product->product_quantity}, Requested: {$quantity}"
                        ], 400);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'valid' => true,
                'message' => 'Stock validation successful'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Stock validation error: ' . $e->getMessage());
            return response()->json([
                'valid' => false,
                'error' => 'Stock validation failed: ' . $e->getMessage()
            ], 500);
        }
    }
    public function createPaymentIntent(Request $request)
    {
        try {
            Stripe::setApiKey(env('STRIPE_SECRET'));

            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:1',
                'currency' => 'sometimes|string|size:3',
                'payment_method_types' => 'sometimes|array',
                'user_id' => 'required|string',
                'seller_id' => 'required|string',
                'order_items' => 'required|array|min:1',
                'order_items.*.product_id' => 'required|string',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.price' => 'required|numeric|min:0',
                'order_items.*.selected_variant' => 'sometimes|array',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed in createPaymentIntent', $validator->errors()->toArray());
                return response()->json(['error' => $validator->errors()->first()], 400);
            }

            $amount = intval($request->amount);
            $currency = strtolower($request->currency ?? 'myr');
            $paymentMethodTypes = $request->payment_method_types ?? ['card'];

            if ($amount < 50) {
                return response()->json(['error' => 'Amount too small'], 400);
            }

            $orderId = Order::generateOrderId();

            // Prepare order items metadata
            $orderItemsMetadata = [];
            foreach ($request->order_items as $index => $item) {
                $orderItemsMetadata[] = [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ];
            }

            Log::info('Creating payment intent for multiple products', [
                'order_id' => $orderId,
                'amount' => $amount,
                'currency' => $currency,
                'user_id' => $request->user_id,
                'seller_id' => $request->seller_id,
                'order_items_count' => count($request->order_items),
                'order_items' => $orderItemsMetadata,
            ]);

            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'payment_method_types' => $paymentMethodTypes,
                'metadata' => [
                    'order_id' => $orderId,
                    'user_id' => $request->user_id,
                    'seller_id' => $request->seller_id,
                    'order_items_count' => count($request->order_items),
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'id' => $paymentIntent->id,
                'orderId' => $orderId,
                'paymentMethodTypes' => $paymentIntent->payment_method_types
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe API error in createPaymentIntent: ' . $e->getMessage());
            return response()->json(['error' => 'Payment service error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            Log::error('Payment intent creation error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    public function confirmPayment(Request $request)
    {
        Log::info('confirmPayment called with data:', $request->all());

        $validator = Validator::make($request->all(), [
            'payment_intent_id' => 'required|string',
            'order_id' => 'required|string',
            'user_id' => 'required|string',
            'seller_id' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'order_items' => 'required|array|min:1',
            'order_items.*.product_id' => 'required|string',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.price' => 'required|numeric|min:0',
            'order_items.*.selected_variant' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed in confirmPayment', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 400);
        }

        try {
            Stripe::setApiKey(env('STRIPE_SECRET'));

            Log::info('Retrieving payment intent: ' . $request->payment_intent_id);
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);
            Log::info('Payment intent status: ' . $paymentIntent->status);

            if ($paymentIntent->status === 'succeeded') {
                $existingOrder = Order::where('order_id', $request->order_id)->first();
                if ($existingOrder) {
                    Log::warning('Order already exists', ['order_id' => $request->order_id]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Order already exists',
                        'order' => $existingOrder
                    ]);
                }

                DB::beginTransaction();

                // Process stock deduction for all order items with race condition protection
                foreach ($request->order_items as $item) {
                    $selectedVariant = $item['selected_variant'] ?? null;
                    $selectedOptions = $item['selected_options'] ?? null;
                    $quantity = $item['quantity'];
                    $productId = $item['product_id'];

                    if ($selectedVariant && isset($selectedVariant['variant_id'])) {
                        // Deduct from variant stock
                        $variant = ProductVariant::where('variant_id', $selectedVariant['variant_id'])
                            ->lockForUpdate()
                            ->first();

                        if (!$variant) {
                            DB::rollBack();
                            return response()->json([
                                'success' => false,
                                'error' => "Variant not found: {$selectedVariant['variant_id']}"
                            ], 404);
                        }

                        if ($variant->quantity < $quantity) {
                            DB::rollBack();
                            return response()->json([
                                'success' => false,
                                'error' => "Insufficient stock for variant. Available: {$variant->quantity}, Requested: {$quantity}"
                            ], 400);
                        }

                        $variant->quantity -= $quantity;
                        $variant->save();

                        Log::info('Variant stock deducted', [
                            'variant_id' => $variant->variant_id,
                            'quantity_deducted' => $quantity,
                            'remaining_stock' => $variant->quantity
                        ]);

                    } elseif ($selectedOptions) {
                        // Deduct from option values (backward compatibility)
                        foreach ($selectedOptions as $optionName => $optionData) {
                            $valueId = $optionData['value_id'] ?? null;

                            if ($valueId) {
                                $optionValue = ProductOptionValue::where('value_id', $valueId)
                                    ->lockForUpdate()
                                    ->first();

                                if (!$optionValue) {
                                    DB::rollBack();
                                    return response()->json([
                                        'success' => false,
                                        'error' => "Option value not found: {$valueId}"
                                    ], 404);
                                }

                                if ($optionValue->quantity < $quantity) {
                                    DB::rollBack();
                                    return response()->json([
                                        'success' => false,
                                        'error' => "Insufficient stock for option. Available: {$optionValue->quantity}, Requested: {$quantity}"
                                    ], 400);
                                }

                                $optionValue->quantity -= $quantity;
                                $optionValue->save();
                            }
                        }
                    } else {
                        // Deduct from main product stock
                        $product = Product::where('product_id', $productId)
                            ->lockForUpdate()
                            ->first();

                        if (!$product) {
                            DB::rollBack();
                            return response()->json([
                                'success' => false,
                                'error' => "Product not found: {$productId}"
                            ], 404);
                        }

                        if ($product->product_quantity < $quantity) {
                            DB::rollBack();
                            return response()->json([
                                'success' => false,
                                'error' => "Insufficient stock for product. Available: {$product->product_quantity}, Requested: {$quantity}"
                            ], 400);
                        }

                        $product->product_quantity -= $quantity;
                        $product->save();

                        Log::info('Product stock deducted', [
                            'product_id' => $product->product_id,
                            'quantity_deducted' => $quantity,
                            'remaining_stock' => $product->product_quantity
                        ]);
                    }
                }

                // Create main order
                $order = Order::create([
                    'order_id' => $request->order_id,
                    'payment_intent_id' => $request->payment_intent_id,
                    'amount' => $request->amount / 100,
                    'currency' => $request->currency,
                    'payment_status' => "paid",
                    'order_status' => 'pending',
                    'user_id' => $request->user_id,
                    'seller_id' => $request->seller_id,
                    'notes' => $request->notes ?? null,
                ]);

                // Create order items
                foreach ($request->order_items as $item) {
                    OrderItem::create([
                        'order_id' => $request->order_id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                        'selected_variant' => $item['selected_variant'] ?? null,
                    ]);
                }

                Log::info('Order created successfully with multiple items', [
                    'order_id' => $order->order_id,
                    'payment_intent_id' => $order->payment_intent_id,
                    'seller_id' => $order->seller_id,
                    'items_count' => count($request->order_items),
                ]);

                try {
                    event(new NewOrderCreated($order));
                } catch (\Throwable $e) {
                    Log::error('Broadcast failed: ' . $e->getMessage());
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment confirmed and order created successfully',
                    'order' => $order->load('orderItems'),
                    'order_items' => $order->orderItems
                ]);
            }

            // Payment failed - create failed order with items
            DB::beginTransaction();

            $order = Order::create([
                'order_id' => $request->order_id,
                'payment_intent_id' => $request->payment_intent_id,
                'amount' => $request->amount / 100,
                'currency' => $request->currency,
                'payment_status' => 'failed',
                'order_status' => "incomplete",
                'user_id' => $request->user_id,
                'seller_id' => $request->seller_id,
                'notes' => 'Payment failed: ' . $paymentIntent->status,
            ]);

            // Create order items even for failed payment (optional)
            foreach ($request->order_items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'selected_variant' => $item['selected_variant'] ?? null,
                    'selected_options' => $item['selected_options'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => false,
                'message' => 'Payment not successful. Status: ' . $paymentIntent->status,
                'order_id' => $order->order_id,
            ], 400);

        } catch (\Exception $e) {
            Log::error('Payment confirmation error: ' . $e->getMessage());
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Internal server error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getOrder($orderId)
    {
        try {
            $order = Order::with('orderItems')->where('order_id', $orderId)->firstOrFail();

            return response()->json([
                'success' => true,
                'order' => $order,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Order not found',
            ], 404);
        }
    }

    public function listOrders(Request $request)
    {
        try {
            $query = Order::with('orderItems');

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('order_status', $request->status);
            }

            // Filter by user_id if provided
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            // Filter by seller_id if provided
            if ($request->has('seller_id')) {
                $query->where('seller_id', $request->seller_id);
            }

            // Date range filter
            if ($request->has('start_date')) {
                $query->where('created_at', '>=', $request->start_date);
            }

            if ($request->has('end_date')) {
                $query->where('created_at', '<=', $request->end_date);
            }

            $orders = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'orders' => $orders,
            ]);

        } catch (\Exception $e) {
            Log::error('List orders error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve orders'], 500);
        }
    }

    public function show_orderSuccess(Request $request)
    {
        return Inertia::render('BuyerPage/OrderSuccess', [
            'order_id' => $request->input('order_id'),
            'payment_intent_id' => $request->input('payment_intent_id'),
            'amount' => $request->input('amount'),
        ]);
    }
}