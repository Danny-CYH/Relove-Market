<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Exception;

class CartController extends Controller
{
    protected $user_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
    }

    // Code for getting all the cart item for specific user
    public function getAllCart()
    {
        $all_cart = Cart::with([
            "product",
            "productImage",
            "productVariant",
        ])
            ->where("user_id", $this->user_id)
            ->get();

        return response()->json(
            $all_cart
        );
    }

    // Code for validate that did the user have ever like the product before
    public function getCart($product_id)
    {
        try {
            $is_cart = Cart::where(
                "product_id",
                $product_id
            )
                ->where("user_id", $this->user_id)
                ->first();

            if ($is_cart != null) {
                return response()->json([
                    "is_cart" => true
                ]);
            }

            return response()->json([
                "is_cart" => false
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    // Code for storing the product as a wishlist
    public function storeWishlist(Request $request)
    {
        $product_id = $request->input("product_id");

        try {
            $wishlistData = [
                'user_id' => $this->user_id,
                'product_id' => $product_id,
            ];

            // Add variant data if provided
            if ($request->has('selected_variant')) {
                $wishlistData['selected_variant'] = json_encode($request->selected_variant);
            }

            // Check if already in cart
            $existingCart = Cart::where('user_id', $this->user_id)
                ->where('product_id', $product_id)
                ->first();

            if ($existingCart) {
                // Update existing cart item with new variant/options
                $existingCart->update($wishlistData);
            } else {
                // Create new cart item
                Cart::create($wishlistData);
            }

            return response()->json([
                'successMessage' => 'Product added to cart successfully',
                "data" => $wishlistData
            ]);
        } catch (Exception $e) {
            return response()->json(["errorMessage" => $e->getMessage()]);
        }
    }

    public function updateVariant(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'variant_data' => 'required|array'
        ]);

        $cartItem = Cart::where('user_id', $this->user_id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'selected_variant' => json_encode($request->variant_data)
            ]);

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false], 404);
    }

    // Code for removing the product from cart (Can removed more than 1 at one time)
    public function removeCart(Request $request)
    {
        try {
            $productIds = $request->input('product_id'); // array from frontend

            if (!is_array($productIds)) {
                $productIds = [$productIds]; // make sure it's an array
            }

            $deletedCount = Cart::where('user_id', $this->user_id)
                ->whereIn('product_id', $productIds)
                ->delete();

            if ($deletedCount > 0) {
                return response()->json([
                    'successMessage' => 'Selected products have been removed from cart'
                ]);
            }

            return response()->json([
                'errorMessage' => 'Products not found in cart'
            ], 404);

        } catch (Exception $e) {
            return response()->json([
                'errorMessage' => $e->getMessage()
            ], 500);
        }
    }
}
