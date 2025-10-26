<?php

namespace App\Http\Controllers;

use App\Events\OrderCompleted;
use App\Models\Order;
use App\Models\ProductFeature;
use App\Models\ProductIncludeItem;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use App\Models\ProductVideo;
use App\Models\Product;
use App\Models\Seller;
use App\Models\Promotions;

use App\Models\Subscription;

use App\Models\SubscriptionPurchaseRecords;
use Exception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use Inertia\Inertia;

use App\Events\ProductUpdated;

use Barryvdh\DomPDF\Facade\Pdf;

class SellerController extends Controller
{
    protected $user_id;

    protected $seller_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
        $this->seller_id = session('seller_id');
    }

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

    public function sellerDashboard()
    {
        return Inertia::render(
            'SellerPage/SellerDashboard'
        );
    }

    public function sellerManageProduct()
    {
        $seller_storeInfo = Seller::with("sellerStore")
            ->where("seller_id", $this->seller_id)
            ->get();

        $list_categories = Category::all();

        return Inertia::render(
            "SellerPage/SellerManageProduct",
            [
                'seller_storeInfo' => $seller_storeInfo,
                'list_categories' => $list_categories,
            ]
        );
    }

    public function sellerOrderPage()
    {
        return Inertia::render("SellerPage/SellerOrderPage");
    }

    public function sellerEarningPage()
    {
        return Inertia::render("SellerPage/SellerEarningPage");
    }

    public function sellerPromotionPage()
    {
        $list_promotion = Promotions::all();

        return Inertia::render(
            "SellerPage/SellerPromotionPage",
            [
                "list_promotion" => $list_promotion
            ]
        );
    }

    public function sellerSubscriptionPage()
    {
        $list_subscription = Subscription::with("subscriptionFeatures")
            ->where(
                "subscription_plan_id",
                "!=",
                "PLAN-TRIAL"
            )
            ->paginate(3);

        $billing_records = SubscriptionPurchaseRecords::with([
            "user",
            "subscription"
        ])
            ->where("seller_id", $this->seller_id)
            ->paginate(5);

        // Loop through each subscription and decode its limits
        $list_subscription->transform(function ($subscription) {
            if (is_string($subscription->limits)) {
                $subscription->limits = json_decode($subscription->limits, true);
            }
            return $subscription;
        });

        return Inertia::render(
            "SellerPage/SellerSubscriptionPage",
            [
                "list_subscription" => $list_subscription,
                "billing_records" => $billing_records,
            ]
        );
    }

    public function sellerHelpSupportPage()
    {
        return Inertia::render("SellerPage/SellerHelpSupportPage");
    }

    public function startTrial(Request $request)
    {
        $request->validate([
            'status' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $trial = Seller::where('seller_id', $this->seller_id)
            ->update([
                'status' => $request->status,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]);

        return response()->json([
            'message' => 'Trial started successfully.',
            'trial' => $trial
        ], 201);
    }

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

    public function get_listOrder(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $status = $request->input('status', '');
            $sort = $request->input('sort', 'created_at');
            $order = $request->input('order', 'desc');
            $page = $request->input('page', 1); // Get the page number

            $query = Order::with(['user', 'orderItems.product', "orderItems.productImage"])
                ->where('seller_id', $this->seller_id);

            // Apply search filter
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_id', 'LIKE', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('email', 'LIKE', "%{$search}%");
                        })
                        ->orWhereHas('orderItems.product', function ($productQuery) use ($search) {
                            $productQuery->where('product_name', 'LIKE', "%{$search}%");
                        })
                        ->orWhere('amount', 'LIKE', "%{$search}%");
                });
            }

            // Apply status filter
            if (!empty($status)) {
                $query->where('order_status', $status);
            }

            // Apply sorting
            $query->orderBy($sort, $order);

            // ALWAYS use pagination, regardless of search
            $paginated = $query->paginate(5, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $paginated->items(),
                'total' => $paginated->total(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'is_search' => !empty($search) // Just indicate if it's a search, but still paginated
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ], 500);
        }
    }

    // In your SellerController or EarningsController
    public function getEarnings(Request $request)
    {
        try {
            $sellerId = $this->seller_id;
            $filter = $request->input('filter', 'monthly');
            $page = $request->input('page', 1);
            $perPage = 5;

            // Total earnings from completed/delivered orders
            $totalEarnings = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->sum('amount');

            // Pending payouts (orders that are delivered but not paid out yet)
            $pendingPayouts = Order::where('seller_id', $sellerId)
                ->where('order_status', 'Delivered')
                ->sum('amount');

            // This month earnings
            $thisMonth = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->sum('amount');

            // Last month earnings
            $lastMonth = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereYear('created_at', now()->subMonth()->year)
                ->whereMonth('created_at', now()->subMonth()->month)
                ->sum('amount');

            // Today's earnings
            $today = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereDate('created_at', today())
                ->sum('amount');

            // Chart data based on filter
            $chartData = [];
            $chartLabels = [];

            switch ($filter) {
                case 'daily':
                    // Last 7 days
                    for ($i = 6; $i >= 0; $i--) {
                        $date = now()->subDays($i);
                        $dailyEarnings = Order::where('seller_id', $sellerId)
                            ->whereIn('order_status', ['Delivered', 'completed'])
                            ->whereDate('created_at', $date->format('Y-m-d'))
                            ->sum('amount');

                        $chartData[] = $dailyEarnings;
                        $chartLabels[] = $date->format('D, M d');
                    }
                    break;

                case 'monthly':
                    // Last 6 months
                    for ($i = 5; $i >= 0; $i--) {
                        $date = now()->subMonths($i);
                        $monthlyEarnings = Order::where('seller_id', $sellerId)
                            ->whereIn('order_status', ['Delivered', 'completed'])
                            ->whereYear('created_at', $date->year)
                            ->whereMonth('created_at', $date->month)
                            ->sum('amount');

                        $chartData[] = $monthlyEarnings;
                        $chartLabels[] = $date->format('M Y');
                    }
                    break;

                case 'yearly':
                    // Last 5 years
                    for ($i = 4; $i >= 0; $i--) {
                        $year = now()->subYears($i)->year;
                        $yearlyEarnings = Order::where('seller_id', $sellerId)
                            ->whereIn('order_status', ['Delivered', 'completed'])
                            ->whereYear('created_at', $year)
                            ->sum('amount');

                        $chartData[] = $yearlyEarnings;
                        $chartLabels[] = $year;
                    }
                    break;
            }

            // Recent transactions with pagination
            $transactionsQuery = Order::with(["orderItems.product"])
                ->where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->orderBy('created_at', 'desc');

            $paginatedTransactions = $transactionsQuery->paginate($perPage, ['*'], 'page', $page);

            $recentTransactions = $paginatedTransactions->map(function ($order) {
                $productName = $order->orderItems->first()->product->product_name ?? 'N/A';

                return [
                    'id' => $order->id,
                    'order_id' => $order->order_id,
                    'date' => $order->created_at,
                    'ref' => $order->order_id,
                    'product_name' => $productName,
                    'amount' => $order->amount,
                    'order_status' => $order->order_status,
                    'payment_status' => $order->is_paid ? 'Paid' : 'Pending',
                ];
            });

            return response()->json([
                'total_earnings' => $totalEarnings,
                'pending_payouts' => $pendingPayouts,
                'this_month' => $thisMonth,
                'last_month' => $lastMonth,
                'today' => $today,
                'chart_data' => [
                    'labels' => $chartLabels,
                    'data' => $chartData,
                ],
                'recent_transactions' => $recentTransactions,
                'pagination' => [
                    'current_page' => $paginatedTransactions->currentPage(),
                    'last_page' => $paginatedTransactions->lastPage(),
                    'per_page' => $paginatedTransactions->perPage(),
                    'total' => $paginatedTransactions->total(),
                    'from' => $paginatedTransactions->firstItem(),
                    'to' => $paginatedTransactions->lastItem(),
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error fetching earnings data: ' . $e->getMessage()
            ], 500);
        }
    }

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

    public function sellerPurchaseSubscription($subscription_plan_id)
    {

        $subscription_plan = Subscription::with("subscriptionFeatures")
            ->where("subscription_plan_id", $subscription_plan_id)
            ->first();

        return Inertia::render(
            "SellerPage/SellerSubscriptionPurchasePage",
            ["subscription_plan" => $subscription_plan]
        );
    }

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

    public function updateStatus(Request $request, $orderId)
    {
        try {
            $order = Order::where('seller_id', $this->seller_id)
                ->findOrFail($orderId);

            $validated = $request->validate([
                'status' => 'required|in:Processing,Shipped,Delivered,Cancelled'
            ]);

            $order->update(['order_status' => $validated['status']]);

            if ($validated['status'] === 'Delivered') {
                // Trigger earnings update
                event(new OrderCompleted($order));
            }

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'order' => $order->load('user', 'product', 'productImage')
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating order status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProfile()
    {
        try {
            $seller_storeInfo = Seller::with([
                "sellerStore"
            ])
                ->where("seller_id", $this->seller_id)
                ->get();

            return Inertia::render("SellerPage/SellerUpdateProfile", [
                "seller_storeInfo" => $seller_storeInfo
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile data'
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $seller = Auth::user();
            $store = $seller->seller_store;

            // Validate personal information
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $seller->id,
                'phone' => 'nullable|string|max:20',
                'store_name' => 'required|string|max:255',
                'store_description' => 'nullable|string',
                'store_address' => 'nullable|string',
                'store_phone' => 'nullable|string|max:20',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
                'store_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            // Update user information
            $seller->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
            ]);

            // Update or create store information
            if ($store) {
                $storeData = [
                    'store_name' => $request->store_name,
                    'store_description' => $request->store_description,
                    'store_address' => $request->store_address,
                    'store_phone' => $request->store_phone,
                ];

                // Handle profile image upload
                if ($request->hasFile('profile_image')) {
                    // Delete old image if exists
                    if ($seller->profile_image) {
                        Storage::delete(str_replace('/storage/', 'public/', $seller->profile_image));
                    }

                    $path = $request->file('profile_image')->store('public/sellers/profile');
                    $seller->update(['profile_image' => '/storage/' . str_replace('public/', '', $path)]);
                }

                // Handle store image upload
                if ($request->hasFile('store_image')) {
                    // Delete old image if exists
                    if ($store->store_image) {
                        Storage::delete(str_replace('/storage/', 'public/', $store->store_image));
                    }

                    $path = $request->file('store_image')->store('public/stores');
                    $storeData['store_image'] = '/storage/' . str_replace('public/', '', $path);
                }

                $store->update($storeData);
            }

            $seller->load('seller_store');

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'seller' => $seller
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    public function generateIncomeReport(Request $request)
    {
        try {
            $sellerId = $this->seller_id;
            $period = $request->input('period', 'monthly');
            $startDate = $request->input('startDate');
            $endDate = $request->input('endDate');
            $format = $request->input('format', 'pdf');
            $includeChart = $request->input('includeChart', true);
            $includeTransactions = $request->input('includeTransactions', true);

            // Set date range based on period
            switch ($period) {
                case 'weekly':
                    $startDate = now()->startOfWeek()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'monthly':
                    $startDate = now()->startOfMonth()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'quarterly':
                    $startDate = now()->startOfQuarter()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'yearly':
                    $startDate = now()->startOfYear()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'custom':
                    // Use provided dates
                    break;
            }

            // Fetch earnings data for the period
            $query = Order::with(['user', 'orderItems.product'])
                ->where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

            $transactions = $query->get();
            $totalEarnings = $transactions->sum('amount');
            $transactionCount = $transactions->count();

            // Prepare report data
            $reportData = [
                'period' => $period,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'generated_at' => now()->toDateTimeString(),
                'seller_info' => [
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                ],
                'summary' => [
                    'total_earnings' => $totalEarnings,
                    'transaction_count' => $transactionCount,
                    'average_order_value' => $transactionCount > 0 ? $totalEarnings / $transactionCount : 0,
                ],
                'transactions' => $includeTransactions ? $transactions->map(function ($order) {
                    return [
                        'order_id' => $order->order_id,
                        'date' => $order->created_at->format('Y-m-d H:i:s'),
                        'customer_name' => $order->user->name ?? 'N/A',
                        'product_name' => $order->orderItems->first()->product->product_name ?? 'N/A',
                        'amount' => $order->amount,
                        'status' => $order->order_status,
                    ];
                }) : [],
            ];

            // Generate report based on format
            switch ($format) {
                case 'pdf':
                    return $this->generatePdfReport($reportData);
                case 'csv':
                    return $this->generateCsvReport($reportData);
                case 'excel':
                    return $this->generateExcelReport($reportData);
                default:
                    return response()->json(['error' => 'Unsupported format'], 400);
            }

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error generating report: ' . $e->getMessage()
            ], 500);
        }
    }

    private function generatePdfReport($data)
    {
        $html = view('reports.income-pdf', compact('data'))->render();

        $pdf = Pdf::loadHTML($html);
        return $pdf->download('income-report.pdf');
    }

    private function generateCsvReport($data)
    {
        $csvContent = "Date,Order ID,Customer,Product,Amount,Status\n";

        foreach ($data['transactions'] as $transaction) {
            $csvContent .= "{$transaction['date']},{$transaction['order_id']},{$transaction['customer_name']},{$transaction['product_name']},{$transaction['amount']},{$transaction['status']}\n";
        }

        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="income-report.csv"');
    }

    private function generateExcelReport($data)
    {
        // For Excel, you might want to use a library like Maatwebsite/Laravel-Excel
        // For now, return CSV as Excel
        return $this->generateCsvReport($data);
    }
}
