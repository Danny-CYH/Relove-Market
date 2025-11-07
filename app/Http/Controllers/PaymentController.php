<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;

use App\Events\SellerPage\NewOrderCreated;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

use Inertia\Inertia;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function validateStock(Request $request)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'order_items' => 'required|array|min:1',
                'order_items.*.product_id' => 'required|string',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.selected_variant' => 'sometimes|array',
                'validation_timestamp' => 'sometimes|numeric',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json([
                    'valid' => false,
                    'error' => $validator->errors()->first()
                ], 400);
            }

            $validationResults = [];
            $allValid = true;
            $validationId = Str::uuid()->toString();

            foreach ($request->order_items as $index => $item) {
                $productId = $item['product_id'];
                $quantity = $item['quantity'];
                $selectedVariant = $item['selected_variant'] ?? null;

                // Create a unique lock key for this product/variant
                $lockKey = "stock_validation_{$productId}";
                if ($selectedVariant && isset($selectedVariant['variant_id'])) {
                    $lockKey .= "_{$selectedVariant['variant_id']}";
                }

                // Use distributed lock to prevent race conditions
                $lock = Cache::lock($lockKey, 10); // 10 second lock

                if (!$lock->get()) {
                    DB::rollBack();
                    return response()->json([
                        'valid' => false,
                        'error' => "Unable to validate stock for item. Please try again."
                    ], 423); // Locked status code
                }

                try {
                    if ($selectedVariant && isset($selectedVariant['variant_id'])) {
                        // Check variant stock with lock
                        $variant = ProductVariant::where('variant_id', $selectedVariant['variant_id'])
                            ->lockForUpdate()
                            ->first();

                        if (!$variant) {
                            $validationResults[] = [
                                'product_id' => $productId,
                                'valid' => false,
                                'error' => "Variant not found"
                            ];
                            $allValid = false;
                            continue;
                        }

                        if ($variant->quantity < $quantity) {
                            $validationResults[] = [
                                'product_id' => $productId,
                                'valid' => false,
                                'error' => "Not enough stock for selected variant. Available: {$variant->quantity}, Requested: {$quantity}"
                            ];
                            $allValid = false;
                        } else {
                            $validationResults[] = [
                                'product_id' => $productId,
                                'variant_id' => $selectedVariant['variant_id'],
                                'valid' => true,
                                'available_quantity' => $variant->quantity
                            ];
                        }
                    } else {
                        // Check main product stock with lock
                        $product = Product::where('product_id', $productId)
                            ->lockForUpdate()
                            ->first();

                        if (!$product) {
                            $validationResults[] = [
                                'product_id' => $productId,
                                'valid' => false,
                                'error' => "Product not found: {$productId}"
                            ];
                            $allValid = false;
                            continue;
                        }

                        if ($product->product_quantity < $quantity) {
                            $validationResults[] = [
                                'product_id' => $productId,
                                'valid' => false,
                                'error' => "Not enough stock for product. Available: {$product->product_quantity}, Requested: {$quantity}"
                            ];
                            $allValid = false;
                        } else {
                            $validationResults[] = [
                                'product_id' => $productId,
                                'valid' => true,
                                'available_quantity' => $product->product_quantity
                            ];
                        }
                    }
                } finally {
                    $lock->release();
                }
            }

            DB::commit();

            if ($allValid) {
                // Store validation result temporarily to prevent race conditions
                Cache::put("stock_validation_{$validationId}", $validationResults, 300); // 5 minutes

                return response()->json([
                    'valid' => true,
                    'message' => 'Stock validation successful',
                    'validation_id' => $validationId,
                    'results' => $validationResults
                ]);
            } else {
                return response()->json([
                    'valid' => false,
                    'error' => 'Some items are out of stock',
                    'details' => $validationResults
                ], 400);
            }

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
        DB::beginTransaction();

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
                'platform_tax' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'subtotal' => 'required|numeric|min:0',
                'shipping' => 'required|numeric|min:0',
                'payment_method' => 'required|string',
                'stock_validation_id' => 'sometimes|string',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                Log::error('Validation failed in createPaymentIntent', $validator->errors()->toArray());
                return response()->json(['error' => $validator->errors()->first()], 400);
            }

            // Verify stock validation if provided
            if ($request->has('stock_validation_id')) {
                $validationResults = Cache::get("stock_validation_{$request->stock_validation_id}");
                if (!$validationResults) {
                    DB::rollBack();
                    return response()->json(['error' => 'Stock validation expired. Please validate your cart again.'], 400);
                }
            }

            $amount = intval($request->amount);
            $currency = strtolower($request->currency ?? 'myr');
            $paymentMethodTypes = $request->payment_method_types ?? ['card'];

            if ($amount < 50) {
                DB::rollBack();
                return response()->json(['error' => 'Amount too small'], 400);
            }

            $orderId = Order::generateOrderId();

            Log::info('Creating payment intent with validation', [
                'order_id' => $orderId,
                'amount' => $amount,
                'validation_id' => $request->stock_validation_id,
            ]);

            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'payment_method_types' => $paymentMethodTypes,
                'metadata' => [
                    'order_id' => $orderId,
                    'user_id' => $request->user_id,
                    'seller_id' => $request->seller_id,
                    'platform_tax' => $request->platform_tax,
                    'tax_amount' => $request->tax_amount,
                    'subtotal' => $request->subtotal,
                    'shipping' => $request->shipping,
                    'payment_method' => $request->payment_method,
                    'order_items_count' => count($request->order_items),
                    'stock_validation_id' => $request->stock_validation_id,
                ],
            ]);

            DB::commit();

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'id' => $paymentIntent->id,
                'orderId' => $orderId,
                'paymentMethodTypes' => $paymentIntent->payment_method_types
            ]);

        } catch (ApiErrorException $e) {
            DB::rollBack();
            Log::error('Stripe API error in createPaymentIntent: ' . $e->getMessage());
            return response()->json(['error' => 'Payment service error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollBack();
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
            'platform_tax' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed in confirmPayment', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 400);
        }

        try {
            // For Cash on Delivery, we don't need to check Stripe
            if ($request->payment_method === 'cod') {
                $paymentStatus = 'pending';
                $orderStatus = 'pending';
            } else {
                Stripe::setApiKey(env('STRIPE_SECRET'));
                Log::info('Retrieving payment intent: ' . $request->payment_intent_id);
                $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);
                Log::info('Payment intent status: ' . $paymentIntent->status);
                $paymentStatus = $paymentIntent->status === 'succeeded' ? 'paid' : 'failed';
                $orderStatus = $paymentIntent->status === 'succeeded' ? 'pending' : 'incomplete';
            }

            // For successful payments or COD
            if ($paymentStatus === 'paid' || $request->payment_method === 'cod') {
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

                // Process stock deduction for all order items
                foreach ($request->order_items as $item) {
                    $selectedVariant = $item['selected_variant'] ?? null;
                    $quantity = $item['quantity'];
                    $productId = $item['product_id'];

                    // Get the product
                    $product = Product::where('product_id', $productId)->lockForUpdate()->first();

                    if (!$product) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'error' => "Product not found: {$productId}"
                        ], 404);
                    }

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

                        $product->product_quantity -= $quantity;
                        $product->save();

                        Log::info('Product stock deducted', [
                            'product_id' => $product->product_id,
                            'quantity_deducted' => $quantity,
                            'remaining_stock' => $product->product_quantity
                        ]);

                        Log::info('Variant stock deducted', [
                            'variant_id' => $variant->variant_id,
                            'quantity_deducted' => $quantity,
                            'remaining_stock' => $variant->quantity
                        ]);
                    }
                }

                // Create main order with payment method
                $order = Order::create([
                    'order_id' => $request->order_id,
                    'payment_intent_id' => $request->payment_intent_id,
                    'amount' => $request->amount / 100,
                    'currency' => $request->currency,
                    'payment_status' => $paymentStatus,
                    'order_status' => $orderStatus,
                    'user_id' => $request->user_id,
                    'seller_id' => $request->seller_id,
                    'platform_tax' => $request->platform_tax,
                    'tax_amount' => $request->tax_amount,
                    'payment_method' => $request->payment_method, // Store payment method
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

                Log::info('Order created successfully', [
                    'order_id' => $order->order_id,
                    'payment_intent_id' => $order->payment_intent_id,
                    'seller_id' => $order->seller_id,
                    'payment_method' => $order->payment_method,
                    'platform_tax' => $order->platform_tax,
                    'tax_amount' => $order->tax_amount,
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
                    'message' => 'Order created successfully',
                    'order' => $order->load('orderItems'),
                    'order_items' => $order->orderItems
                ]);
            } else {
                // Payment failed
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
                    'platform_tax' => $request->platform_tax,
                    'tax_amount' => $request->tax_amount,
                    'payment_method' => $request->payment_method,
                    'notes' => 'Payment failed: ' . ($paymentIntent->status ?? 'unknown'),
                ]);

                // Create order items for failed payment
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
                    'message' => 'Payment not successful. Status: ' . ($paymentIntent->status ?? 'unknown'),
                    'order_id' => $order->order_id,
                ], 400);
            }
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