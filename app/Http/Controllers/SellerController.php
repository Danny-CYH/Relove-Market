<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\ProductImage;
use App\Models\ProductVideo;
use App\Models\Product;
use App\Models\Seller;

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
        $seller_storeInfo = Seller::with("sellerStore")->where("seller_id", $this->seller_id)->get();

        $list_categories = Category::all();
        $list_products = Product::with(["productImage", "productVideo", "category"])->where("seller_id", $this->seller_id)->get();

        return Inertia::render(
            "SellersPage/SellerProductPage",
            [
                'seller_storeInfo' => $seller_storeInfo,
                'list_categories' => $list_categories,
                'list_products' => $list_products,
            ]
        );
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
        try {
            $request->validate([
                'product_name' => 'required|string|max:255',
                'product_description' => 'required|string',
                'product_price' => 'required|numeric|min:0',
                'product_condition' => 'required|string',
                'product_quantity' => 'required|integer|min:1',
                'product_status' => 'required|string',
                'product_categories' => 'required|exists:categories,category_id',
                'product_image.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
                'product_video.*' => 'nullable|mimes:mp4,mov,avi,wmv,mkv|max:51200',
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
                        "products/{$this->seller_id}/{$productId}/image",
                        $filename,
                        'public'
                    );

                    ProductImage::create([
                        'product_id' => $productId,
                        'image_path' => $path,
                    ]);
                }
            }

            if ($request->hasFile('product_video')) {
                foreach ($request->file('product_video') as $video) {
                    $filename = uniqid() . '.' . $video->getClientOriginalExtension();

                    $path = $video->storeAs(
                        "products/{$this->seller_id}/{$productId}/video",
                        $filename,
                        'public'
                    );

                    ProductVideo::create([
                        'product_id' => $productId,
                        'video_path' => $path,
                    ]);
                }
            }

            return response()->json([
                "successMessage" => "Product Added Successfully!",
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage(),
            ]);
        }
    }

    public function sellerEditProduct(Request $request)
    {
        try {
            $request->validate([
                'product_name' => 'required|string|max:255',
                'product_description' => 'required|string',
                'product_price' => 'required|numeric|min:0',
                'product_condition' => 'required|string',
                'product_quantity' => 'required|integer|min:1',
                'product_status' => 'required|string',
                'product_categories' => 'required|exists:categories,category_id',
                'product_image.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:51200',
                'product_video.*' => 'nullable|mimes:mp4,mov,avi,wmv,mkv|max:51200',
            ]);

            $product = Product::with(["productImage", "productVideo"])
                ->where("product_id", $request->product_id)
                ->first();

            $product->update([
                'product_name' => $request->product_name,
                'product_description' => $request->product_description,
                'product_price' => $request->product_price,
                'product_condition' => $request->product_condition,
                'product_quantity' => $request->product_quantity,
                'product_status' => $request->product_status,
                'category_id' => $request->product_categories,
            ]);

            // Replace existing images
            if ($request->hasFile('product_image')) {
                // delete old images from DB and storage
                foreach ($product->productImage as $oldImage) {
                    \Storage::disk('public')->delete($oldImage->image_path);
                    $oldImage->delete();
                }

                // upload new images
                foreach ($request->file('product_image') as $image) {
                    $path = $image->store("products/{$this->seller_id}/{$request->product_id}/image", 'public');
                    ProductImage::create([
                        'product_id' => $request->product_id,
                        'image_path' => $path,
                    ]);
                }
            }

            // Replace existing videos
            if ($request->hasFile('product_video')) {
                foreach ($product->productVideo as $oldVideo) {
                    \Storage::disk('public')->delete($oldVideo->video_path);
                    $oldVideo->delete();
                }

                foreach ($request->file('product_video') as $video) {
                    $path = $video->store("products/{$this->seller_id}/{$request->product_id}/video", 'public');
                    ProductVideo::create([
                        'product_id' => $request->product_id,
                        'video_path' => $path,
                    ]);
                }
            }

            return response()->json([
                'successMessage' => "Product updated successfully"
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    public function sellerDeleteProduct(Request $request)
    {
        try {
            $product_data = Product::with("productImage", "productVideo")->find($request->product_id);

            if ($product_data) {
                // Build the product directory path
                $directory = 'products/' . $product_data->seller_id . '/' . $product_data->product_id;

                // Delete the entire product folder
                \Storage::disk('public')->deleteDirectory($directory);

                $product_data->delete();
            }

            return response()->json([
                "successMessage" => "Product Deleted Successfully!",
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage(),
            ]);
        }
    }

    public function get_ListProduct()
    {
        $list_products = Product::with(["productImage", "productVideo", "category"])->where("seller_id", $this->seller_id)->get();

        return response()->json([
            "list_products" => $list_products,
        ]);
    }
}
