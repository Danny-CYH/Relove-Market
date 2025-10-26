<?php

namespace App\Http\Controllers\SellerPage;

use App\Http\Controllers\Controller;

use App\Models\Seller;
use App\Models\Subscription;
use App\Models\SubscriptionPurchaseRecords;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use Carbon\Carbon;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class SubscriptionPaymentController extends Controller
{
    public function createSubscriptionPaymentIntent(Request $request)
    {
        try {
            Stripe::setApiKey(env('STRIPE_SECRET'));

            $validator = Validator::make($request->all(), [
                'subscription_plan_id' => 'required|exists:subscriptions,subscription_plan_id',
                'amount' => 'required|numeric|min:1',
                'currency' => 'sometimes|string|size:3',
                'payment_method_types' => 'sometimes|array',
                'user_id' => 'required|string',
                'seller_id' => 'required|string',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed in createSubscriptionPaymentIntent', $validator->errors()->toArray());
                return response()->json(['error' => $validator->errors()->first()], 400);
            }

            $plan = Subscription::findOrFail($request->subscription_plan_id);
            $amount = intval($request->amount);
            $currency = strtolower($request->currency ?? 'myr');
            $paymentMethodTypes = $request->payment_method_types ?? ['card', 'grabpay'];

            if ($amount < 50) {
                return response()->json(['error' => 'Amount too small'], 400);
            }

            $receipt_id = SubscriptionPurchaseRecords::generateReceiptId();

            Log::info('Creating subscription payment intent', [
                'receipt_id' => $receipt_id,
                'subscription_plan_id' => $plan->subscription_plan_id,
                'plan_name' => $plan->name,
                'amount' => $amount,
                'currency' => $currency,
                'user_id' => $request->user_id,
                'seller_id' => $request->seller_id,
                'duration_days' => $plan->duration,
            ]);

            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'payment_method_types' => $paymentMethodTypes,
                'metadata' => [
                    'subscription_plan_id' => $plan->subscription_plan_id,
                    'plan_name' => $plan->name,
                    'user_id' => $request->user_id,
                    'seller_id' => $request->seller_id,
                    'duration_days' => $plan->duration,
                    'type' => 'subscription',
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'id' => $paymentIntent->id,
                'receipt_id' => $receipt_id,
                'subscription_plan_id' => $plan->subscription_plan_id,
                'paymentMethodTypes' => $paymentIntent->payment_method_types
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe API error in createSubscriptionPaymentIntent: ' . $e->getMessage());
            return response()->json(['error' => 'Payment service error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            Log::error('Subscription payment intent creation error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    public function confirmSubscriptionPayment(Request $request)
    {
        Log::info('confirmSubscriptionPayment called with data:', $request->all());

        $validator = Validator::make($request->all(), [
            'payment_intent_id' => 'required|string',
            'user_id' => 'required|string',
            'seller_id' => 'required|string',
            'subscription_plan_id' => 'required|exists:subscriptions,subscription_plan_id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed in confirmSubscriptionPayment', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 400);
        }

        try {
            Stripe::setApiKey(env('STRIPE_SECRET'));

            Log::info('Retrieving subscription payment intent: ' . $request->payment_intent_id);
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);
            Log::info('Subscription payment intent status: ' . $paymentIntent->status);

            if ($paymentIntent->status === 'succeeded') {
                $existingSubscription = SubscriptionPurchaseRecords::where('subscription_plan_id', $request->subscription_plan_id)
                    ->where('seller_id', $request->seller_id)
                    ->first();
                if ($existingSubscription) {
                    Log::warning('Subscription already exists', ['subscription_id' => $request->subscription_plan_id]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Subscription already exists',
                        'subscription' => $existingSubscription
                    ]);
                }

                DB::beginTransaction();

                try {
                    // Create the subscription record
                    $subscription = SubscriptionPurchaseRecords::create([
                        'receipt_id' => $request->receipt_id,
                        'payment_intent_id' => $request->payment_intent_id,
                        'amount' => $request->amount / 100,
                        'currency' => $request->currency,
                        'user_id' => $request->user_id,
                        'seller_id' => $request->seller_id,
                        'subscription_plan_id' => $request->subscription_plan_id,
                        'payment_status' => 'paid',
                    ]);

                    Log::info('Subscription created successfully', [
                        'subscription_id' => $subscription->subscription_id,
                        'payment_intent_id' => $subscription->payment_intent_id,
                        'seller_id' => $subscription->seller_id,
                        'plan_id' => $subscription->subscription_plan_id,
                        'end_date' => $subscription->end_date,
                    ]);

                    // Calculate subscription dates
                    $startDate = Carbon::now();
                    $endDate = Carbon::now()->addDays($subscription->duration);

                    // Update user's subscription status
                    $seller = Seller::find($request->seller_id);
                    if ($seller) {
                        $seller->update([
                            'subscription_plan_id' => $subscription->subscription_plan_id,
                            'start_date' => $startDate,
                            'end_date' => $endDate,
                            'status' => 'active',
                        ]);
                    }

                    // You can add an event here for new subscription if needed
                    // event(new NewSubscriptionCreated($subscription));

                    DB::commit();

                    return response()->json([
                        'success' => true,
                        'message' => 'Subscription payment confirmed and subscription activated successfully',
                        'subscription' => $subscription
                    ]);

                } catch (\Exception $e) {
                    DB::rollBack();
                    Log::error('Subscription creation error: ' . $e->getMessage());
                    throw $e;
                }
            }

            // Payment failed - create failed subscription record
            $subscription = SubscriptionPurchaseRecords::create([
                'receipt_id' => $request->receipt_id,
                'payment_intent_id' => $request->payment_intent_id,
                'amount' => $request->amount / 100,
                'currency' => $request->currency,
                'user_id' => $request->user_id,
                'seller_id' => $request->seller_id,
                'subscription_plan_id' => $request->subscription_plan_id,
                'payment_status' => 'failed',
                'notes' => 'Payment failed: ' . $paymentIntent->status,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Subscription payment not successful. Status: ' . $paymentIntent->status,
                'subscription_id' => $subscription->subscription_id,
            ], 400);

        } catch (\Exception $e) {
            Log::error('Subscription payment confirmation error: ' . $e->getMessage());
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Internal server error: ' . $e->getMessage()
            ], 500);
        }
    }
}