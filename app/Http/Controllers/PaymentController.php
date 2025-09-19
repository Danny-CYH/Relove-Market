<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $amount = intval($request->amount); // in cents
        $currency = $request->currency ?? 'myr';

        $orderId = 'ORD-' . strtoupper(uniqid());

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'payment_method_types' => ['card', 'grabpay'],
                'metadata' => [
                    'order_id' => $orderId,
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'id' => $paymentIntent->id,
                'orderId' => $orderId,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function confirmPayment(Request $request)
    {
        // Validate the request
        $request->validate([
            'payment_intent_id' => 'required',
            'order_id' => 'required',
            'postal_code' => 'required',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Retrieve the payment intent
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            // Confirm the payment was successful
            if ($paymentIntent->status === 'succeeded') {
                // Update your order in the database
                $order = Order::find($request->order_id);
                $order->status = 'completed';
                $order->payment_intent_id = $request->payment_intent_id;
                $order->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment confirmed successfully',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not successful',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
