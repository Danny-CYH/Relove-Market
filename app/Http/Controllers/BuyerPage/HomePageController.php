<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;

use App\Models\Product;

use Exception;

class HomePageController extends Controller
{
    // Code for fetching the featured product on home page.
    public function get_featuredProducts()
    {
        try {
            $featured_products = Product::with([
                "ratings",
                'category',
                "productImage"
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
