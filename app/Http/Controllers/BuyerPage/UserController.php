<?php

namespace App\Http\Controllers\BuyerPage;

use App\Models\Business;
use App\Models\Category;
use App\Models\Product;
use App\Models\Wishlist;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Inertia\Inertia;

class UserController extends Controller
{
    protected $user_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
    }

    // Code for returning the home page
    public function homepage()
    {
        $list_shoppingItem = Product::with([
            'productImage',
            'category'
        ])
            ->get();

        $list_categoryItem = Category::all();

        return Inertia::render(
            'BuyerPage/HomePage',
            [
                "list_shoppingItem" => $list_shoppingItem,
                "list_categoryItem" => $list_categoryItem,
            ]
        );
    }

    // Code for returning the about us page
    public function aboutus()
    {
        return Inertia::render('BuyerPage/AboutUs');
    }

    // Code for returning the shopping page (some bug, product details cannot return back to shop page)
    public function shopping(Request $request)
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

        // If it's an AJAX request, return JSON
        if ($request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'list_shoppingItem' => $list_shoppingItem,
                'list_categoryItem' => $list_categoryItem,
            ]);
        }

        // ✅ This part allows both visiting and filtering
        if ($request->wantsJson()) {
            // AJAX request (used by filter/search)
            return response()->json([
                'list_shoppingItem' => $list_shoppingItem,
                'list_categoryItem' => $list_categoryItem,
            ]);
        }

        // Regular Inertia response for initial load
        return Inertia::render("BuyerPage/ShopPage", [
            'list_shoppingItem' => $list_shoppingItem,
            'list_categoryItem' => $list_categoryItem,
            'filters' => $request->only(['search', 'categories', 'price_range', 'sort_by', 'conditions'])
        ]);
    }

    // Code for returning the seller benefit page
    public function sellerBenefit()
    {
        return Inertia::render("BuyerPage/SellerBenefit");
    }

    // Code for returning the product details page
    public function productDetails($product_id)
    {
        $product_info = Product::with([
            'productImage',
            "productVideo",
            "productFeature",
            "productIncludeItem",
            "productVariant",
            "seller.sellerStore",
            "ratings.user",
            "orders",
        ])
            ->where('product_id', $product_id)
            ->get();

        return Inertia::render(
            "BuyerPage/ProductDetails",
            [
                'product_info' => $product_info,
            ]
        );
    }

    // Code for returning the seller registration page
    public function sellerRegistration()
    {
        $list_business = Business::all();

        return Inertia::render(
            "BuyerPage/SellerRegistration",
            [
                'list_business' => $list_business
            ]
        );
    }

    // Code for returning the seller shop page
    public function sellerShop()
    {
        return Inertia::render('BuyerPage/SellerShop');
    }

    // Code for returning the wishlist page
    public function wishlist()
    {
        $user_wishlist = Wishlist::with([
            "user",
            "product",
            "productImage",
            "product.seller",
            "productVariant"
        ])
            ->where("user_id", $this->user_id)
            ->get();

        return Inertia::render(
            "BuyerPage/Wishlist",
            [
                "user_wishlist" => $user_wishlist,
            ]
        );
    }

    // Code for returning the profile page
    public function profile()
    {
        return Inertia::render("BuyerPage/ProfilePage");
    }

    // Code for returning the buyer chat page
    public function buyerChat()
    {
        return Inertia::render("BuyerPage/BuyerChatPage");
    }

    // Code for returning the checkout page
    public function checkout(Request $request)
    {
        $list_product = $request->input('items');
        $single_checkoutData = $request->input('single_checkoutData');

        $platform_tax = 0.08;

        if ($single_checkoutData && !$list_product) {

            $list_product = $single_checkoutData;
        }

        return Inertia::render('BuyerPage/Checkout', [
            'list_product' => $list_product,
            'platform_tax' => $platform_tax,
        ]);
    }
}
