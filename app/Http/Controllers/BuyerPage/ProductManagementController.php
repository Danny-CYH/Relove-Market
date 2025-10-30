<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;

use App\Events\BuyerPage\ProductDetails\ReviewsUpdate;

use App\Models\Category;
use App\Models\Product;
use App\Models\Rating;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use Exception;

use Inertia\Inertia;

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
        $query = Product::with(['productImage', 'category', 'ratings']);

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', '%' . $search . '%')
                    ->orWhere('product_description', 'like', '%' . $search . '%')
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

        $response = Http::post(env('ML_SERVICE_URL') . '/recommend/', [
            'product_id' => $productId,
            'top_k' => 5
        ]);

        $data = $response->json();

        if (!isset($data['recommendations'])) {
            return response()->json(['error' => 'No recommendations found'], 404);
        }

        // Extract product_ids
        $productIds = collect($data['recommendations'])
            ->pluck('product_id')
            ->toArray();

        // Query your DB for full product info
        $products = Product::with(
            [
                "productImage",
                "productVideo",
                "productFeature",
                "productIncludeItem",
                "ratings",
                "category",
            ]

        )
            ->whereIn('product_id', $productIds)
            ->get();

        // Map products with similarity scores
        $recommendations = collect($data['recommendations'])->map(function ($rec) use ($products) {
            $product = $products->firstWhere('product_id', $rec['product_id']);
            return [
                'product_id' => $rec['product_id'],
                'similarity' => $rec['similarity'],
                'product' => $product // full product details from DB
            ];
        });

        return response()->json(["recommendations" => $recommendations]);
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

    // ✅ NEW: Function to update product ratings summary
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
}
