<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\ProductImage;
use App\Models\Product;

use Inertia\Inertia;

class SellerController extends Controller
{
    protected $seller_id;

    public function __construct()
    {
        $this->seller_id = session('seller_id');
    }
    public function sellerDashboard()
    {
        return Inertia::render('SellersPage/SellerDashboard');
    }

    public function sellerProductPage()
    {

        $list_categories = Category::all();

        return Inertia::render("SellersPage/SellerProductPage", ['list_categories' => $list_categories]);
    }

    public function sellerOrderPage()
    {
        return Inertia::render("SellersPage/SellerOrderPage");
    }

    public function sellerEarningPage()
    {
        return Inertia::render("SellersPage/SellerEarningPage");
    }

    public function sellerPromotionPage()
    {
        return Inertia::render("SellersPage/SellerPromotionPage");
    }

    public function sellerSubscriptionPage()
    {
        return Inertia::render("SellersPage/SellerSubscriptionPage");
    }

    public function sellerHelpSupportPage()
    {
        return Inertia::render("SellersPage/SellerHelpSupportPage");
    }

    public function sellerAddProduct(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'required|string',
            'product_price' => 'required|numeric|min:0',
            'product_condition' => 'required|string',
            'product_quantity' => 'required|integer|min:1',
            'product_status' => 'required|string',
            'product_categories' => 'required|exists:categories,category_id',
            'product_image.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120'
        ]);

        // ✅ Generate a unique product ID
        $productId = 'PROD-' . strtoupper(Str::random(8));

        Product::create([
            'product_id' => $productId,
            'product_name' => $request->product_name,
            'product_description' => $request->product_description,
            'product_price' => $request->product_price,
            'product_condition' => $request->product_condition,
            'product_quantity' => $request->product_quantity,
            'product_status' => $request->product_status,
            'category_id' => $request->product_categories,
            'seller_id' => $this->seller_id,
        ]);

        if ($request->hasFile('product_image')) {
            foreach ($request->file('product_image') as $image) {
                $filename = uniqid() . '.' . $image->getClientOriginalExtension();

                $path = $image->storeAs(
                    "products/{$this->seller_id}/{$productId}",
                    $filename,
                    'public'
                );

                ProductImage::create([
                    'product_id' => $productId,
                    'image_path' => $path,
                ]);
            }
        }

        return back()->with('successMessage', "New products added successfully");
    }
}
