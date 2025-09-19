<?php

namespace App\Http\Controllers;

use App\Models\ProductFeature;
use App\Models\ProductIncludeItem;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVideo;
use App\Models\Product;
use App\Models\Seller;
use App\Models\Promotions;

use Exception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

use Inertia\Inertia;

use App\Events\ProductUpdated;

class SellerController extends Controller
{
    protected $user_id;

    protected $seller_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
        $this->seller_id = session('seller_id');
    }
    public function sellerDashboard()
    {
        return Inertia::render('SellersPage/SellerDashboard');
    }

    public function sellerManageProduct()
    {
        $seller_storeInfo = Seller::with("sellerStore")
            ->where("seller_id", $this->seller_id)
            ->get();

        $list_categories = Category::all();
        $list_products = Product::with([
            "productImage",
            "productVideo",
            "productFeature",
            "productIncludeItem",
            "productOption.productOptionValue",
            "category"
        ])->where("seller_id", $this->seller_id)->get();

        return Inertia::render(
            "SellersPage/SellerManageProduct",
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
        $list_promotion = Promotions::all();

        return Inertia::render(
            "SellersPage/SellerPromotionPage",
            [
                "list_promotion" => $list_promotion
            ]
        );
    }

    public function sellerSubscriptionPage()
    {
        return Inertia::render("SellersPage/SellerSubscriptionPage");
    }

    public function sellerHelpSupportPage()
    {
        return Inertia::render("SellersPage/SellerHelpSupportPage");
    }

    public function sellerChatPage()
    {
        $seller_storeInfo = Seller::with("sellerStore")->where("seller_id", $this->seller_id)->get();

        return Inertia::render(
            'SellersPage/SellerChatPage',
            [
                "seller_storeInfo" => $seller_storeInfo,
            ]
        );
    }

    public function get_ListProduct()
    {
        $list_product = Product::with([
            "productImage",
            "productVideo",
            "productFeature",
            "productIncludeItem",
            "productOption.productOptionValue",
            "category"
        ])
            ->where("seller_id", $this->seller_id)->get();

        return response()->json([
            "list_product" => $list_product,
        ]);
    }

    public function sellerAddProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string|max:255',
            'product_description' => 'required|string',
            'product_price' => 'required|string|min:0',
            'product_quantity' => 'required|integer|min:1',
            'product_status' => 'required|in:available,reserved,sold,draft',
            'product_condition' => 'required|in:new,excellent,good,fair,poor',
            'product_brand' => 'nullable|string|max:255',
            'product_material' => 'nullable|string|max:255',
            'product_manufacturer' => 'nullable|string|max:255',
            'product_weight' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,category_id',
            'key_features.*' => 'required|string|max:255',
            'included_items.*' => 'string|max:255',
            'product_optionName.*' => 'string|max:255',
            'product_optionValue.*' => 'string|max:255',
            'product_image.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
            'product_video.*' => 'nullable|mimes:mp4,mov,avi,wmv,mkv|max:51200',
        ], [
            'product_name.required' => 'Product name is required',
            'product_description.required' => 'Product description is required',
            'product_price.required' => 'Product price is required',
            'category_id.required' => 'Product category is required',
            'key_features.required' => 'At least one key feature is required',
            'key_features.min' => 'At least one key feature is required',
            'product_image.required' => 'At least one image is required',
            'product_image.min' => 'At least one image is required',
            'product_image.*.image' => 'Uploaded files must be images',
            'product_image.*.max' => 'Images must be less than 10MB',
            'product_video.*.max' => 'Videos must be less than 100MB',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'successMessage' => false,
                'errorMessage' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // ✅ Generate a unique product ID
            $productId = 'PROD-' . strtoupper(Str::random(8));

            $product = Product::create([
                'product_id' => $productId,
                'product_name' => $request->product_name,
                'product_description' => $request->product_description,
                'product_price' => $request->product_price,
                'product_condition' => $request->product_condition,
                'product_quantity' => $request->product_quantity,
                'product_status' => $request->product_status,
                'product_brand' => $request->product_brand,
                'product_material' => $request->product_material,
                'product_manufacturer' => $request->product_manufacturer,
                'product_weight' => $request->product_weight,
                'category_id' => $request->category_id,
                'seller_id' => $this->seller_id,
            ]);

            // Add key features
            if ($request->has('key_features')) {
                foreach ($request->key_features as $feature) {
                    if (!empty(trim($feature))) {
                        // ✅ Get last feature id
                        $latestFeature = ProductFeature::orderBy('feature_id', 'desc')->first();

                        $number = ($latestFeature && preg_match('/FTR-(\d+)/', $latestFeature->feature_id, $matches))
                            ? (int) $matches[1] + 1
                            : 1;

                        $newFeatureId = 'FTR-' . str_pad($number, 5, '0', STR_PAD_LEFT);

                        // ✅ Save feature
                        ProductFeature::create([
                            'feature_id' => $newFeatureId,
                            'product_id' => $productId,
                            'feature_text' => trim($feature),
                        ]);
                    }
                }
            }

            // Add included items
            if ($request->has('included_items')) {
                foreach ($request->included_items as $item) {
                    if (!empty(trim($item))) {
                        $latestItem = ProductIncludeItem::orderBy('item_id', 'desc')->first();

                        $number = ($latestItem && preg_match('/ITM-(\d+)/', $latestItem->item_id, $matches))
                            ? (int) $matches[1] + 1
                            : 1;

                        $newItemId = 'ITM-' . str_pad($number, 5, '0', STR_PAD_LEFT);

                        ProductIncludeItem::create([
                            'item_id' => $newItemId,
                            'product_id' => $productId,
                            'item_name' => trim($item),
                        ]);
                    }
                }
            }

            // Add product options
            if ($request->has('options')) {
                foreach ($request->options as $optionData) {
                    if (!empty($optionData['name']) && !empty($optionData['values'])) {
                        $latestItem = ProductOption::orderBy('option_id', 'desc')->first();

                        $optionId = ($latestItem && preg_match('/OPT-(\d+)/', $latestItem->option_id, $matches))
                            ? (int) $matches[1] + 1
                            : 1;

                        $newOptionId = 'OPT-' . str_pad($optionId, 5, '0', STR_PAD_LEFT);

                        ProductOption::create([
                            'option_id' => $newOptionId,
                            'product_id' => $productId,
                            'option_name' => $optionData['name']
                        ]);

                        foreach ($optionData['values'] as $value) {
                            if (!empty(trim($value))) {
                                $latestValue = ProductOptionValue::orderBy('value_id', 'desc')->first();

                                $valueId = ($latestValue && preg_match('/VAL-(\d+)/', $latestValue->value_id, $matches))
                                    ? (int) $matches[1] + 1
                                    : 1;

                                $newValueId = 'VAL-' . str_pad($valueId, 5, '0', STR_PAD_LEFT);

                                ProductOptionValue::create([
                                    'value_id' => $newValueId,
                                    'option_id' => $newOptionId,
                                    'option_value' => trim($value),
                                ]);
                            }
                        }
                    }
                }
            }

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

                    // Get full storage path to the image
                    $fullPath = storage_path("app/public/{$path}");

                    // Send to FastAPI
                    Http::attach(
                        'image',
                        file_get_contents($fullPath),
                        $filename
                    )->asMultipart()->post('https://recommendation-product-service.onrender.com/add_product/', [
                                ['name' => 'product_id', 'contents' => $productId], // force int
                                ['name' => 'name', 'contents' => $request->product_name],
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

            // fire the event for instantly update the product list
            broadcast(new ProductUpdated($product, "created"));

            return response()->json([
                "successMessage" => "Product Added Successfully!",
            ]);
        } catch (Exception $e) {
            \Log::error("SellerAddProduct error", [
                "message" => $e->getMessage(),
                "trace" => $e->getTraceAsString(),
                "line" => $e->getLine(),
                "file" => $e->getFile(),
            ]);

            return response()->json([
                "errorMessage" => $e->getMessage(),
                "line" => $e->getLine(),
                "file" => $e->getFile(),
            ], 500);
        }
    }

    public function sellerEditProduct(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,product_id',
                'product_name' => 'required|string|max:255',
                'product_description' => 'required|string',
                'product_price' => 'required|numeric|min:0',
                'product_quantity' => 'required|integer|min:1',
                'product_status' => 'required|in:available,reserved,sold,draft',
                'product_condition' => 'required|in:new,excellent,good,fair,poor',
                'product_brand' => 'nullable|string|max:255',
                'product_size' => 'nullable|string|max:50',
                'product_material' => 'nullable|string|max:255',
                'product_manufacturer' => 'nullable|string|max:255',
                'product_weight' => 'nullable|numeric|min:0',
                'category_id' => 'required|exists:categories,category_id',
                'key_features.*' => 'nullable|string|max:255',
                'included_items.*' => 'nullable|string|max:255',
                'product_optionName.*' => 'nullable|string|max:255',
                'product_optionValue.*' => 'nullable|string|max:255',
                'product_image.*' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
                'product_video.*' => 'nullable|mimes:mp4,mov,avi,wmv,mkv|max:51200',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'successMessage' => false,
                    'errorMessage' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product = Product::with([
                "productImage",
                "productVideo",
                "productFeature",
                "productIncludeItem",
                "productOption.productOptionValue"
            ])
                ->where("product_id", $request->product_id)
                ->first();

            if (!$product) {
                return response()->json(["errorMessage" => "Product not found"], 404);
            }

            // ✅ Update main product info
            $product->update([
                'product_name' => $request->product_name,
                'product_description' => $request->product_description,
                'product_price' => $request->product_price,
                'product_condition' => $request->product_condition,
                'product_quantity' => $request->product_quantity,
                'product_status' => $request->product_status,
                'product_brand' => $request->product_brand,
                'product_size' => $request->product_size,
                'product_material' => $request->product_material,
                'product_manufacturer' => $request->product_manufacturer,
                'product_weight' => $request->product_weight,
                'category_id' => $request->category_id,
            ]);

            // ✅ Replace key features
            $product->productFeature()->delete();
            if ($request->has('key_features')) {
                foreach ($request->key_features as $feature) {
                    if (!empty(trim($feature))) {
                        $latestFeature = ProductFeature::orderBy('feature_id', 'desc')->first();
                        $number = ($latestFeature && preg_match('/FTR-(\d+)/', $latestFeature->feature_id, $matches))
                            ? (int) $matches[1] + 1
                            : 1;

                        $newFeatureId = 'FTR-' . str_pad($number, 5, '0', STR_PAD_LEFT);

                        ProductFeature::create([
                            'feature_id' => $newFeatureId,
                            'product_id' => $product->product_id,
                            'feature_text' => trim($feature),
                        ]);
                    }
                }
            }

            // ✅ Replace included items
            $product->productIncludeItem()->delete();
            if ($request->has('included_items')) {
                foreach ($request->included_items as $item) {
                    if (!empty(trim($item))) {
                        $latestItem = ProductIncludeItem::orderBy('item_id', 'desc')->first();
                        $number = ($latestItem && preg_match('/ITM-(\d+)/', $latestItem->item_id, $matches))
                            ? (int) $matches[1] + 1
                            : 1;

                        $newItemId = 'ITM-' . str_pad($number, 5, '0', STR_PAD_LEFT);

                        ProductIncludeItem::create([
                            'item_id' => $newItemId,
                            'product_id' => $product->product_id,
                            'item_name' => trim($item),
                        ]);
                    }
                }
            }

            // ✅ Replace product options + values
            if ($request->has('options')) {
                foreach ($request->options as $option) {
                    if (!empty(trim($option['name']))) {
                        // Try to find existing option
                        $existingOption = ProductOption::where('product_id', $product->product_id)
                            ->where('option_id', $option['id'] ?? null) // assuming request sends option_id
                            ->first();

                        if ($existingOption) {
                            // Update
                            $existingOption->update([
                                'option_name' => trim($option['name']),
                            ]);
                        } else {
                            $latestOption = ProductOption::orderBy('option_id', 'desc')->first();
                            $number = ($latestOption && preg_match('/OPT-(\d+)/', $latestOption->option_id, $matches))
                                ? (int) $matches[1] + 1
                                : 1;
                            $newOptionId = 'OPT-' . str_pad($number, 5, '0', STR_PAD_LEFT);

                            $newOption = ProductOption::create([
                                'option_id' => $newOptionId,
                                'product_id' => $product->product_id,
                                'option_name' => trim($option['name']),
                            ]);
                        }

                        if (!empty($option['values'])) {
                            foreach ($option['values'] as $value) {
                                if (!empty(trim($value))) {

                                    $existingValue = ProductOptionValue::where('option_id', $existingOption->option_id)
                                        ->where('value_id', $value['id'] ?? null) // assuming request sends value_id
                                        ->first();

                                    if ($existingValue) {
                                        // Update
                                        $existingValue->update([
                                            'option_value' => trim($value['name']),
                                        ]);
                                    } else {
                                        $latestValue = ProductOptionValue::orderBy('value_id', 'desc')->first();
                                        $vnumber = ($latestValue && preg_match('/VAL-(\d+)/', $latestValue->value_id, $vmatches))
                                            ? (int) $vmatches[1] + 1
                                            : 1;
                                        $newValueId = 'VAL-' . str_pad($vnumber, 5, '0', STR_PAD_LEFT);

                                        ProductOptionValue::create([
                                            'value_id' => $newValueId,
                                            'option_id' => $newOption->option_id,
                                            'option_value' => trim($value),
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // ✅ Replace images
            if ($request->hasFile('product_image')) {
                foreach ($product->productImage as $oldImage) {
                    \Storage::disk('public')->delete($oldImage->image_path);
                    $oldImage->delete();
                }

                foreach ($request->file('product_image') as $image) {
                    $filename = uniqid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs(
                        "products/{$this->seller_id}/{$product->product_id}/image",
                        $filename,
                        'public'
                    );

                    ProductImage::create([
                        'product_id' => $product->product_id,
                        'image_path' => $path,
                    ]);
                }
            }

            // ✅ Replace videos
            if ($request->hasFile('product_video')) {
                foreach ($product->productVideo as $oldVideo) {
                    \Storage::disk('public')->delete($oldVideo->video_path);
                    $oldVideo->delete();
                }

                foreach ($request->file('product_video') as $video) {
                    $filename = uniqid() . '.' . $video->getClientOriginalExtension();
                    $path = $video->storeAs(
                        "products/{$this->seller_id}/{$product->product_id}/video",
                        $filename,
                        'public'
                    );

                    ProductVideo::create([
                        'product_id' => $product->product_id,
                        'video_path' => $path,
                    ]);
                }
            }

            broadcast(new ProductUpdated($product, "updated"));

            return response()->json([
                'successMessage' => "Product updated successfully"
            ]);
        } catch (Exception $e) {
            \Log::error("SellerEditProduct error", [
                "message" => $e->getMessage(),
                "trace" => $e->getTraceAsString(),
            ]);
            return response()->json([
                "errorMessage" => $e->getMessage()
            ], 500);
        }
    }

    public function sellerDeleteProduct(Request $request)
    {
        try {
            $product = Product::with(
                "productImage",
                "productVideo",
                "productFeature",
                "productIncludeItem",
                "productOption",
                "productOption.productOptionValue",
                "productEmbeddings",
            )
                ->find($request->product_id);

            if ($product) {
                $directory = 'products/' . $product->seller_id . '/' . $product->product_id;

                // Delete image files
                foreach ($product->productImage as $image) {
                    \Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }

                // Delete video files
                foreach ($product->productVideo as $video) {
                    \Storage::disk('public')->delete($video->video_path);
                    $video->delete();
                }

                // Delete folder if still exists
                \Storage::disk('public')->deleteDirectory($directory);

                // Finally delete product
                $product->delete();
            }

            broadcast(new ProductUpdated(['product_id' => $request->product_id], "deleted"));

            return response()->json([
                "successMessage" => "Product Deleted Successfully!",
            ]);
        } catch (Exception $e) {
            \Log::error("SellerDeleteProduct error", [
                "message" => $e->getMessage(),
                "trace" => $e->getTraceAsString(),
            ]);

            return response()->json([
                "errorMessage" => $e->getMessage(),
            ]);
        }
    }

    public function sellerAddPromotion(Request $request)
    {
        try {
            // ✅ Validate request
            $validated = $request->validate([
                'promotion_name' => 'required|string|max:255',
                'promotion_discount' => 'required|string|max:50', // can be percentage or text like "BOGO"
                'promotion_type' => 'required|in:Flash Sale,Voucher,Free Shipping',
                'promotion_startDate' => 'required|date|before:promotion_endDate',
                'promotion_endDate' => 'required|date|after:promotion_startDate',
                'promotion_status' => 'required|in:Active,Paused,Expired',
                'promotion_usage' => 'nullable|integer|min:1',
                'promotion_badge' => 'nullable|string|max:50',
            ]);

            // ✅ Create promotion
            Promotions::create([
                'promotion_id' => Str::uuid()->toString(),
                'promotion_name' => $validated['promotion_name'],
                'promotion_discount' => $validated['promotion_discount'],
                'promotion_type' => $validated['promotion_type'],
                'promotion_startDate' => $validated['promotion_startDate'],
                'promotion_endDate' => $validated['promotion_endDate'],
                'promotion_status' => $validated['promotion_status'],
                'promotion_limit' => $validated['promotion_usage'] ?? null,
            ]);

            return response()->json([
                "successMessage" => "Promotion Created Successfully!"
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    public function sellerEditPromotion(Request $request)
    {

    }
    public function sellerDeletePromotion(Request $request)
    {

    }
    public function sellerViewPromotion(Request $request)
    {

    }
}
