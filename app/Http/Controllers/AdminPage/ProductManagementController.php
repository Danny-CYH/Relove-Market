<?php

namespace App\Http\Controllers\AdminPage;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductManagementController extends Controller
{
    public function get_allProducts(Request $request)
    {
        $query = Product::with([
            'productImage',
            'seller.sellerStore',
            'ratings',
            'category'
        ])
            ->withCount([
                'ratings',
                'ratings as negative_reviews_count' => function ($query) {
                    $query->where('rating', '<=', 2);
                }
            ]);

        // Search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('category_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('seller', function ($q) use ($search) {
                        $q->where('seller_name', 'like', "%{$search}%");
                    });
            });
        }

        // Status filter
        if ($request->has('status') && !empty($request->status)) {
            $query->where('products.product_status', $request->status);
        }

        // Rating filter
        if ($request->has('rating') && !empty($request->rating)) {
            switch ($request->rating) {
                case 'low':
                    $query->where('products.average_rating', '<', 2.5);
                    break;
                case 'medium':
                    $query->whereBetween('products.average_rating', [2.5, 4]);
                    break;
                case 'high':
                    $query->where('products.average_rating', '>=', 4);
                    break;
            }
        }

        // Pagination
        $perPage = $request->get('per_page', 5);
        $products = $query->paginate($perPage);

        return response()->json([
            "allProducts" => $products
        ]);
    }

    public function get_product_stats()
    {
        $stats = [
            'flagged' => Product::where('product_status', 'flagged')->count(),
            'blocked' => Product::where('product_status', 'blocked')->count(),
            // 'lowRated' => Product::where('average_rating', '<', 2.5)->count(),
            'active' => Product::where('product_status', 'active')->count(),
        ];

        return response()->json($stats);
    }

    public function update_product_status(Request $request, $productId, $action)
    {
        $product = Product::findOrFail($productId);

        $statusMap = [
            'block' => 'blocked',
            'unblock' => 'active',
            'flag' => 'flagged'
        ];

        if (array_key_exists($action, $statusMap)) {
            $product->status = $statusMap[$action];
            $product->save();

            return response()->json(['message' => 'Product status updated successfully']);
        }

        return response()->json(['error' => 'Invalid action'], 400);
    }
}