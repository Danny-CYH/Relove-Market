<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = Session::create([
            'payment_method_types' => ['fpx'],
            'mode' => 'payment',
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'myr',
                        'unit_amount' => 5000, // RM50.00
                        'product_data' => [
                            'name' => 'Preloved Item',
                        ],
                    ],
                    'quantity' => 1,
                ]
            ],
            'success_url' => env('APP_URL') . '/success',
            'cancel_url' => env('APP_URL') . '/cancel',
        ]);

        return response()->json(['url' => $session->url]);
    }
}
