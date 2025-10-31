<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;

use App\Models\Product;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    public function cameraSearch(Request $request)
    {
        // Validate uploaded image
        $request->validate([
            'image' => 'required|image|max:5120', // max 5MB
        ]);

        // Get the uploaded image
        $image = $request->file('image');

        // Send image to ML API
        $response = Http::attach(
            'image',
            file_get_contents($image),
            $image->getClientOriginalName()
        )->post(env('ML_SERVICE_URL') . '/camera_recommend/', [
                    'top_k' => 5
                ]);

        $data = $response->json();

        if (!isset($data['recommendations'])) {
            return response()->json(['error' => 'No recommendations found'], 404);
        }

        // Extract product_ids
        $productIds = collect($data['recommendations'])->pluck('product_id')->toArray();

        // Fetch full product info from DB
        $products = Product::with([
            "productImage",
            "productVideo",
            "productFeature",
            "productIncludeItem",
            "ratings",
            "category",
        ])
            ->whereIn('product_id', $productIds)
            ->get();

        $recommendations = collect($data['recommendations'])
            ->filter(fn($rec) => $rec['similarity'] >= 0.6)
            ->map(function ($rec) use ($products) {
                $product = $products->firstWhere('product_id', $rec['product_id']);
                return [
                    'product_id' => $rec['product_id'],
                    'similarity' => $rec['similarity'],
                    'product' => $product
                ];
            });

        if ($recommendations->isEmpty()) {
            return response()->json(['error' => 'No similar products found'], 404);
        }

        return response()->json(["recommendations" => $recommendations]);
    }

    // Code for fetching the featured product on home page.
    public function get_featuredProducts()
    {
        try {
            $featured_products = Product::with([
                "seller.sellerStore",
                "ratings",
                'category',
                "productImage",
                "productVariant"
            ])
                ->where("featured", true)
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

    // Code for fetching the flash sale product on home page.
    public function get_flashSaleProducts()
    {
        try {
            $flash_sale_products = Product::with([
                "productImage"
            ])
                ->where("flash_sale", true)
                ->get();

            return response()->json([
                "flash_sale_products" => $flash_sale_products
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }
}
