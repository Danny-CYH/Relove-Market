<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;

use App\Events\BuyerPage\ProductDetails\ReviewsUpdate;

use App\Mail\ProductBlockedNotification;
use App\Mail\ProductFlaggedNotification;
use App\Mail\ProductUnblockedNotification;
use App\Models\Category;
use App\Models\Product;
use App\Models\Rating;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use Exception;
use Illuminate\Support\Facades\Mail;

class ProductManagementController extends Controller
{
    protected $user_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
    }

    // Code for API/filter requests
    public function shoppingApi(Request $request)
    {
        $query = Product::with([
            'productImage',
            'productVariant',
            'category',
            'ratings',
            'seller.sellerStore'
        ]);

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', '%' . $search . '%')
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('category_name', 'like', '%' . $search . '%');
                    });
            });
        }

        // Apply category filter
        if ($request->has('categories') && is_array($request->categories) && count($request->categories) > 0) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->whereIn('category_name', $request->categories);
            });
        }

        // Apply price range filter
        if ($request->has('price_range') && is_array($request->price_range) && count($request->price_range) === 2) {
            $query->whereBetween('product_price', $request->price_range);
        }

        // Apply condition filter
        if ($request->has('conditions') && is_array($request->conditions) && count($request->conditions) > 0) {
            $query->whereIn('product_condition', $request->conditions);
        }

        // Apply sorting
        if ($request->has('sort_by')) {
            switch ($request->sort_by) {
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'price-low':
                    $query->orderBy('product_price', 'asc');
                    break;
                case 'price-high':
                    $query->orderBy('product_price', 'desc');
                    break;
                case 'rating':
                    $query->orderBy('average_rating', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $list_shoppingItem = $query->paginate(6);
        $list_categoryItem = Category::all();

        return response()->json([
            'list_shoppingItem' => $list_shoppingItem,
            'list_categoryItem' => $list_categoryItem,
        ]);
    }

    // Code for calling the similar product based on product image
    public function getRecommendations(Request $request)
    {
        $productId = $request->input('product_id');
        $topK = $request->input('top_k', 5);
        $similarityThreshold = $request->input('similarity_threshold', 0.70);

        try {
            $response = Http::timeout(30)->post(env('ML_SERVICE_URL') . '/recommend/', [
                'product_id' => $productId,
                'top_k' => $topK,
                'similarity_threshold' => $similarityThreshold
            ]);

            if (!$response->successful()) {
                \Log::error('ML service error: ' . $response->body());
                return response()->json(['error' => 'Recommendation service unavailable'], 500);
            }

            $data = $response->json();

            // Check if we have an error from ML service
            if (isset($data['error'])) {
                return response()->json([
                    'error' => $data['error'],
                    'message' => $data['message'] ?? 'No recommendations found',
                    'closest_match_similarity' => $data['closest_match_similarity'] ?? null,
                    'similarity_threshold' => $data['similarity_threshold'] ?? null
                ], 404);
            }

            // Check if we have recommendations
            if (!isset($data['recommendations']) || empty($data['recommendations'])) {
                return response()->json([
                    'error' => 'No recommendations found',
                    'message' => 'No similar products found above the similarity threshold',
                    'similarity_threshold' => $data['similarity_threshold'] ?? 0.70
                ], 404);
            }

            // Extract product_ids
            $productIds = collect($data['recommendations'])
                ->pluck('product_id')
                ->toArray();

            \Log::info('Fetching products from database', ['product_ids' => $productIds]);

            // Query your DB for full product info
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

            \Log::info('Found products in database', ['count' => $products->count()]);

            // Map products with similarity scores and maintain order
            $recommendations = collect($data['recommendations'])
                ->map(function ($rec) use ($products) {
                    $product = $products->firstWhere('product_id', $rec['product_id']);

                    if (!$product) {
                        \Log::warning('Product not found in database', ['product_id' => $rec['product_id']]);
                        return null;
                    }

                    return [
                        'product_id' => $rec['product_id'],
                        'similarity' => $rec['similarity'],
                        'similarity_percentage' => round($rec['similarity'] * 100, 1),
                        'ai_confidence' => $rec['similarity'] >= 0.8 ? 'high' : ($rec['similarity'] >= 0.6 ? 'medium' : 'low'),
                        'product' => $product
                    ];
                })
                ->filter()
                ->values();

            \Log::info('Final recommendations', ['count' => $recommendations->count()]);

            if ($recommendations->isEmpty()) {
                return response()->json([
                    'error' => 'Products not found in database',
                    'message' => 'Recommended products were not found in the local database'
                ], 404);
            }

            return response()->json([
                "recommendations" => $recommendations,
                "search_metrics" => $data['search_metrics'] ?? [],
                "source_product" => $data['source_product'] ?? null,
                "source_category" => $data['source_category'] ?? null,
                "similarity_threshold" => $data['similarity_threshold'] ?? 0.70,
                "total_found" => $data['total_found'] ?? count($recommendations)
            ]);

        } catch (Exception $e) {
            \Log::error('Recommendation error: ' . $e->getMessage());
            return response()->json(['error' => 'Recommendation failed: ' . $e->getMessage()], 500);
        }
    }

    // Code for user to make a review and comment on the product and store in the database.
    public function make_review(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,product_id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:1000',
            ]);

            $review = Rating::create([
                'product_id' => $validated['product_id'],
                'user_id' => $this->user_id, // or $request->user_id if passed
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]);

            $review->load("user");

            // ✅ NEW: Update product ratings summary
            $this->updateProductRatings($validated['product_id']);

            // Broadcast event
            broadcast(new ReviewsUpdate($review));

            return response()->json([
                'message' => 'Review submitted successfully.',
                'review' => $review
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    // Function to update product ratings summary
    private function updateProductRatings($productId)
    {
        try {
            // Get all ratings for this product
            $ratings = Rating::where('product_id', $productId)->get();

            if ($ratings->count() > 0) {
                // Calculate average rating
                $averageRating = $ratings->avg('rating');
                $totalRatings = $ratings->count();

                // Calculate rating distribution
                $ratingDistribution = [
                    5 => $ratings->where('rating', 5)->count(),
                    4 => $ratings->where('rating', 4)->count(),
                    3 => $ratings->where('rating', 3)->count(),
                    2 => $ratings->where('rating', 2)->count(),
                    1 => $ratings->where('rating', 1)->count(),
                ];

                // Update product table
                Product::where('product_id', $productId)->update([
                    'total_ratings' => round($averageRating, 2),
                ]);

                \Log::info("Product ratings updated for product ID: {$productId}", [
                    'average_rating' => $averageRating,
                    'total_ratings' => $totalRatings,
                    'rating_distribution' => $ratingDistribution
                ]);
            }

        } catch (Exception $e) {
            \Log::error("Error updating product ratings for product ID: {$productId}", [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function get_allProducts(Request $request)
    {
        try {
            $query = Product::with(['category', 'seller.sellerStore', 'ratings']);

            // Search filter
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('product_name', 'like', "%{$search}%")
                        ->orWhereHas('seller', function ($q) use ($search) {
                            $q->where('seller_name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('category', function ($q) use ($search) {
                            $q->where('category_name', 'like', "%{$search}%");
                        });
                });
            }

            // Status filter
            if ($request->has('status') && $request->status) {
                $query->where('product_status', $request->status);
            }

            // Rating filter
            if ($request->has('rating') && $request->rating) {
                switch ($request->rating) {
                    case 'low':
                        $query->whereHas('ratings', function ($q) {
                            $q->havingRaw('AVG(rating) < 2.5');
                        });
                        break;
                    case 'medium':
                        $query->whereHas('ratings', function ($q) {
                            $q->havingRaw('AVG(rating) BETWEEN 2.5 AND 4');
                        });
                        break;
                    case 'high':
                        $query->whereHas('ratings', function ($q) {
                            $q->havingRaw('AVG(rating) > 4');
                        });
                        break;
                }
            }

            // Pagination
            $perPage = $request->per_page ?? 10;
            $products = $query->paginate($perPage);

            // Add calculated fields for frontend
            $products->getCollection()->transform(function ($product) {
                $product->average_rating = $product->ratings->avg('rating') ?? 0;
                $product->reviews_count = $product->ratings->count();
                $product->negative_reviews_count = $product->ratings->where('rating', '<', 3)->count();
                return $product;
            });

            return response()->json([
                'products' => $products
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch products',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function get_product_stats()
    {
        try {
            $totalProducts = Product::count();
            $activeProducts = Product::where('product_status', 'available')->count();
            $flaggedProducts = Product::where('product_status', 'flagged')->count();
            $blockedProducts = Product::where('product_status', 'blocked')->count();

            // Count low rated products (average rating < 2.5)
            $lowRatedProducts = Product::with('ratings')
                ->get()
                ->filter(function ($product) {
                    return ($product->ratings->avg('rating') ?? 0) < 2.5;
                })
                ->count();

            return response()->json([
                'total' => $totalProducts,
                'active' => $activeProducts,
                'flagged' => $flaggedProducts,
                'blocked' => $blockedProducts,
                'lowRated' => $lowRatedProducts,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch product stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function block_product(Request $request, $productId)
    {
        try {
            $product = Product::with(['seller', 'category'])->findOrFail($productId);

            // Store the original status before blocking
            $originalStatus = $product->product_status;

            // Update product status to blocked
            $product->update([
                'product_status' => 'blocked',
                'blocked_at' => now(),
                'block_reason' => $request->reason ?? 'Violation of platform policies'
            ]);

            // Send email notification to the seller
            if ($product->seller && $product->seller->email) {
                Mail::to($product->seller->email)->send(
                    new ProductBlockedNotification($product, $request->reason)
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Product has been blocked successfully',
                'product' => $product
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to block product',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function unblock_product(Request $request, $productId)
    {
        try {
            $product = Product::with(['seller', 'category'])->findOrFail($productId);

            // Update product status back to available
            $product->update([
                'product_status' => 'available',
                'blocked_at' => null,
                'block_reason' => null
            ]);

            // Send email notification for unblocking
            if ($product->seller && $product->seller->email) {
                Mail::to($product->seller->email)->send(
                    new ProductUnblockedNotification($product)
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Product has been unblocked successfully',
                'product' => $product
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to unblock product',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function flag_product(Request $request, $productId)
    {
        try {
            $product = Product::with(['seller', 'category'])->findOrFail($productId);

            $originalStatus = $product->product_status;

            $product->update([
                'product_status' => 'flagged',
                'flagged_at' => now(),
                'flag_reason' => $request->reason ?? 'Under review for policy violation'
            ]);

            // Send email notification for flagging
            if ($product->seller && $product->seller->email) {
                Mail::to($product->seller->email)->send(
                    new ProductFlaggedNotification($product, $request->reason)
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Product has been flagged successfully',
                'product' => $product
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to flag product',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
