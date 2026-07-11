<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Traits\UserTrait;
use Illuminate\Http\Request;
use Exception;

class CartController extends Controller
{
    use UserTrait;

    public function getAllCart()
    {
        $all_cart = Cart::with([
            "product.seller.sellerStore",
            "product.category",
            "productImage",
            "productVariant",
        ])
            ->where("user_id", $this->userId())
            ->get();

        return CartResource::collection($all_cart);
    }

    public function getCart($product_id)
    {
        try {
            $is_cart = Cart::where("product_id", $product_id)
                ->where("user_id", $this->userId())
                ->first();

            return response()->json([
                "is_cart" => $is_cart ? true : false
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    public function storeToCart(Request $request)
    {
        $product_id = $request->input("product_id");

        try {
            $cartData = [
                'user_id' => $this->userId(),  // ✅ 改成 $this->userId()
                'product_id' => $product_id,
            ];

            if ($request->has('selected_variant')) {
                $cartData['selected_variant'] = json_encode($request->selected_variant);
            }

            $existingCart = Cart::where('user_id', $this->userId())
                ->where('product_id', $product_id)
                ->first();

            if ($existingCart) {
                $existingCart->update($cartData);
            } else {
                Cart::create($cartData);
            }

            return response()->json([
                'successMessage' => 'Product added to cart successfully',
                "data" => $cartData
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

        $cartItem = Cart::where('user_id', $this->userId())
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

    public function removeCart($product_id)
    {
        try {
            if (!is_array($product_id)) {
                $productIds = [$product_id];
            }

            $deletedCount = Cart::where('user_id', $this->userId())
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