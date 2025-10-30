<?php

namespace App\Http\Controllers\SellerPage;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\Product;
use App\Models\Seller;

use Exception;

use Illuminate\Http\Request;

use Carbon\Carbon;

class SellerDashboardController extends Controller
{
    protected $user_id;

    protected $seller_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
        $this->seller_id = session('seller_id');
    }

    // Code for getting the subscription status for seller
    public function getSubscriptionStatus()
    {
        $seller = Seller::with([
            "subscription",
            "subscription.subscriptionFeatures"
        ])
            ->where("seller_id", $this->seller_id)
            ->first();

        if ($seller && $seller->subscription && $seller->subscription->limits) {
            // Decode the JSON string
            $seller->subscription->limits = json_decode($seller->subscription->limits, true);
        }

        return response()->json([
            "seller" => $seller,
        ]);
    }

    // Display the start trial for first time login seller.
    public function startTrial(Request $request)
    {
        $request->validate([
            'status' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        // Convert from UTC to Malaysia timezone (UTC+8)
        $startDate = Carbon::parse($request->start_date)->setTimezone('Asia/Kuala_Lumpur');
        $endDate = Carbon::parse($request->end_date)->setTimezone('Asia/Kuala_Lumpur');

        Seller::where('seller_id', $this->seller_id)
            ->update([
                'status' => $request->status,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);

        return response()->json([
            'message' => 'Trial started successfully.',
        ], 201);
    }

    // Get the data for the seller dashboard
    public function getData_dashboard()
    {
        $seller_storeInfo = Seller::with([
            "sellerStore",
            "product",
        ])
            ->where("seller_id", $this->seller_id)
            ->get();

        $order_data = Order::with([
            "orderItems.product",
            "user",
        ])
            ->where(
                "seller_id",
                $this->seller_id
            )
            ->orderBy("created_at", "desc")
            ->get();

        return response()->json([
            "seller_storeInfo" => $seller_storeInfo,
            "order_data" => $order_data
        ]);
    }

    // Get the data for featured products
    public function get_FeaturedProducts()
    {
        try {
            $featured_products = Product::with([
                "productImage"
            ])
                ->where("featured", True)
                ->get();

            return response()->json([
                "featured_products" => $featured_products
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }
}
