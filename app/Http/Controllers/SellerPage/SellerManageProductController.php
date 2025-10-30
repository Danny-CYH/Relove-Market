<?php

namespace App\Http\Controllers\SellerPage;

use App\Events\ProductUpdated;
use App\Http\Controllers\Controller;

use App\Models\Product;

use App\Models\ProductFeature;
use App\Models\ProductImage;
use App\Models\ProductIncludeItem;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use App\Models\ProductVideo;
use Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SellerManageProductController extends Controller
{
    protected $user_id;

    protected $seller_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
        $this->seller_id = session('seller_id');
    }

    // Code for getting all the product for the current login seller
    public function get_ListProduct(Request $request)
    {
        $searchTerm = $request->get('search', '');
        $statusFilter = $request->get('status', 'all');
        $categoryFilter = $request->get('category', 'all');
        $sortBy = $request->get('sort', 'created_at_desc');

        $query = Product::with([
            "productImage",
            "productVideo",
            "productFeature",
            "productIncludeItem",
            "productOption.productOptionValue",
            "productVariant",
            "category"
        ])->where("seller_id", $this->seller_id);

        // Apply search across ALL products
        if (!empty($searchTerm)) {
            $query->where('product_name', 'like', '%' . $searchTerm . '%');
        }

        // Apply status filter
        if ($statusFilter !== 'all') {
            $query->where('product_status', $statusFilter);
        }

        // Apply category filter
        if ($categoryFilter !== 'all') {
            $query->where('category_id', $categoryFilter);
        }

        // Apply sorting
        switch ($sortBy) {
            case 'name':
                $query->orderBy('product_name', 'asc');
                break;
            case 'price-high':
                $query->orderBy('product_price', 'desc');
                break;
            case 'price-low':
                $query->orderBy('product_price', 'asc');
                break;
            case 'stock-high':
                $query->orderBy('product_quantity', 'desc');
                break;
            case 'stock-low':
                $query->orderBy('product_quantity', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $list_product = $query->paginate(5);

        return response()->json([
            "list_product" => $list_product,
        ]);
    }

    // Code for seller to add the new products
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

            if ($request->has('variants')) {
                foreach ($request->variants as $variantData) {
                    $combination = json_decode($variantData['combination'], true);
                    $quantity = $variantData['quantity'] ?? 0;
                    $price = $variantData['price'] ?? $request->product_price;
                    $variantKey = $variantData['variant_key'];

                    // Generate variant ID
                    $latestVariant = ProductVariant::orderBy('variant_id', 'desc')->first();
                    $variantId = ($latestVariant && preg_match('/VAR-(\d+)/', $latestVariant->variant_id, $matches))
                        ? (int) $matches[1] + 1
                        : 1;
                    $newVariantId = 'VAR-' . str_pad($variantId, 5, '0', STR_PAD_LEFT);

                    // Create variant
                    ProductVariant::create([
                        'variant_id' => $newVariantId,
                        'product_id' => $productId,
                        'variant_combination' => json_encode($combination),
                        'variant_key' => $variantKey,
                        'quantity' => $quantity,
                        'price' => $price,
                    ]);
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

    // Code for seller to edit the products data
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
                'new_product_images.*' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:5120', // Updated field name
                'new_product_videos.*' => 'nullable|mimes:mp4,mov,avi,wmv,mkv|max:51200', // Updated field name
                'images_to_delete.*' => 'nullable|string', // Add validation for delete arrays
                'videos_to_delete.*' => 'nullable|string', // Add validation for delete arrays
                'variants.*.combination' => 'nullable|string',
                'variants.*.quantity' => 'nullable|integer|min:0',
                'variants.*.price' => 'nullable|numeric|min:0',
                'variants.*.variant_key' => 'nullable|string',
                'variants.*.variant_id' => 'nullable|string|exists:product_variants,variant_id',
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
                "productOption.productOptionValue",
                "productVariant"
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

            // ✅ Handle product options (for variant generation)
            if ($request->has('options')) {
                // Get all existing option IDs for this product
                $existingOptionIds = ProductOption::where('product_id', $product->product_id)
                    ->pluck('option_id')
                    ->toArray();

                $submittedOptionIds = [];

                foreach ($request->options as $option) {
                    if (!empty(trim($option['name']))) {
                        // Try to find existing option
                        $existingOption = ProductOption::where('product_id', $product->product_id)
                            ->where('option_id', $option['id'] ?? null)
                            ->first();

                        if ($existingOption) {
                            // Update
                            $existingOption->update([
                                'option_name' => trim($option['name']),
                            ]);
                            $currentOption = $existingOption;
                            $submittedOptionIds[] = $existingOption->option_id;
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
                            $currentOption = $newOption;
                            $submittedOptionIds[] = $newOptionId;
                        }

                        // ✅ Handle option values
                        $existingValueIds = ProductOptionValue::where('option_id', $currentOption->option_id)
                            ->pluck('value_id')
                            ->toArray();

                        $submittedValueIds = [];

                        if (!empty($option['values'])) {
                            foreach ($option['values'] as $value) {
                                if (!empty(trim($value['name'] ?? $value))) {
                                    $valueId = $value['id'] ?? null;
                                    $valueName = $value['name'] ?? $value;

                                    $existingValue = ProductOptionValue::where('option_id', $currentOption->option_id)
                                        ->where('value_id', $valueId)
                                        ->first();

                                    if ($existingValue) {
                                        // Update existing value
                                        $existingValue->update([
                                            'option_value' => trim($valueName),
                                        ]);
                                        $submittedValueIds[] = $existingValue->value_id;
                                    } else {
                                        // Create new value
                                        $latestValue = ProductOptionValue::orderBy('value_id', 'desc')->first();
                                        $vnumber = ($latestValue && preg_match('/VAL-(\d+)/', $latestValue->value_id, $vmatches))
                                            ? (int) $vmatches[1] + 1
                                            : 1;
                                        $newValueId = 'VAL-' . str_pad($vnumber, 5, '0', STR_PAD_LEFT);

                                        $newValue = ProductOptionValue::create([
                                            'value_id' => $newValueId,
                                            'option_id' => $currentOption->option_id,
                                            'option_value' => trim($valueName),
                                        ]);
                                        $submittedValueIds[] = $newValueId;
                                    }
                                }
                            }
                        }

                        // ✅ Delete values that were removed from this option
                        $valuesToDelete = array_diff($existingValueIds, $submittedValueIds);
                        if (!empty($valuesToDelete)) {
                            ProductOptionValue::where('option_id', $currentOption->option_id)
                                ->whereIn('value_id', $valuesToDelete)
                                ->delete();
                        }
                    }
                }
                // ✅ Delete options that were completely removed
                $optionsToDelete = array_diff($existingOptionIds, $submittedOptionIds);
                if (!empty($optionsToDelete)) {
                    // First delete associated values
                    ProductOptionValue::whereIn('option_id', $optionsToDelete)->delete();
                    // Then delete the options
                    ProductOption::whereIn('option_id', $optionsToDelete)->delete();
                }
            } else {
                // ✅ If no options are submitted, delete all existing options and values
                ProductOptionValue::whereIn('option_id', function ($query) use ($product) {
                    $query->select('option_id')
                        ->from('product_options')
                        ->where('product_id', $product->product_id);
                })->delete();

                ProductOption::where('product_id', $product->product_id)->delete();
            }

            // ✅ Handle product variants
            if ($request->has('variants')) {
                // Get all existing variant IDs for this product
                $existingVariantIds = ProductVariant::where('product_id', $product->product_id)
                    ->pluck('variant_id')
                    ->toArray();

                $submittedVariantIds = [];

                foreach ($request->variants as $variantData) {
                    $combination = json_decode($variantData['combination'], true);
                    $quantity = $variantData['quantity'] ?? 0;
                    $price = $variantData['price'] ?? $request->product_price;
                    $variantKey = $variantData['variant_key'];
                    $variantId = $variantData['variant_id'] ?? null;

                    if ($variantId) {
                        // Update existing variant
                        $existingVariant = ProductVariant::where('variant_id', $variantId)->first();
                        if ($existingVariant) {
                            $existingVariant->update([
                                'variant_combination' => json_encode($combination),
                                'variant_key' => $variantKey,
                                'quantity' => $quantity,
                                'price' => $price,
                            ]);
                            $submittedVariantIds[] = $variantId;
                        }
                    } else {
                        // Create new variant
                        $latestVariant = ProductVariant::orderBy('variant_id', 'desc')->first();
                        $variantNumber = ($latestVariant && preg_match('/VAR-(\d+)/', $latestVariant->variant_id, $matches))
                            ? (int) $matches[1] + 1
                            : 1;
                        $newVariantId = 'VAR-' . str_pad($variantNumber, 5, '0', STR_PAD_LEFT);

                        ProductVariant::create([
                            'variant_id' => $newVariantId,
                            'product_id' => $product->product_id,
                            'variant_combination' => json_encode($combination),
                            'variant_key' => $variantKey,
                            'quantity' => $quantity,
                            'price' => $price,
                        ]);
                        $submittedVariantIds[] = $newVariantId;
                    }
                }

                // ✅ Delete variants that were removed
                $variantsToDelete = array_diff($existingVariantIds, $submittedVariantIds);
                if (!empty($variantsToDelete)) {
                    ProductVariant::whereIn('variant_id', $variantsToDelete)->delete();
                }
            } else {
                // ✅ If no variants are submitted, delete all existing variants
                ProductVariant::where('product_id', $product->product_id)->delete();
            }

            // ✅ Handle image deletions
            if ($request->has('images_to_delete')) {
                foreach ($request->images_to_delete as $imageId) {
                    $image = ProductImage::where('id', $imageId)->first();
                    if ($image) {
                        \Storage::disk('public')->delete($image->image_path);
                        $image->delete();
                    }
                }
            }

            // ✅ Handle video deletions
            if ($request->has('videos_to_delete')) {
                foreach ($request->videos_to_delete as $videoId) {
                    $video = ProductVideo::where('id', $videoId)->first();
                    if ($video) {
                        \Storage::disk('public')->delete($video->video_path);
                        $video->delete();
                    }
                }
            }

            // ✅ Add new images (append, don't replace)
            if ($request->hasFile('new_product_images')) {
                foreach ($request->file('new_product_images') as $image) {
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

            // ✅ Add new videos (append, don't replace)
            if ($request->hasFile('new_product_videos')) {
                foreach ($request->file('new_product_videos') as $video) {
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

    // Code for seller to delete the product data
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

    // Code for seller to trigger the availability of the products
    public function toggleProductListing(Request $request)
    {
        try {
            $product_id = $request->input("product_id");
            $status = $request->input("status");

            $product = Product::where("product_id", $product_id)->first();

            if (!$product) {
                return response()->json([
                    "error" => "Product not found"
                ], 404);
            }

            $product->update([
                "product_status" => $status
            ]);

            return response()->json([
                "success" => true,
                "message" => "Product status updated successfully",
                "product" => $product
            ]);
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }

    // Code for seller to trigger the product feature availability
    public function toggleProductFeatured(Request $request)
    {
        try {
            $product_id = $request->input("product_id");
            $featured = $request->input("featured");

            $product = Product::where("product_id", $product_id)->first();

            if (!$product) {
                return response()->json([
                    "error" => "Product not found"
                ], 404);
            }

            $product->update([
                "featured" => $featured
            ]);

            return response()->json([
                "success" => true,
                "message" => "Product featured status updated successfully",
                "product" => $product
            ]);
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
