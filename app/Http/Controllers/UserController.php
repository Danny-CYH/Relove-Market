<?php

namespace App\Http\Controllers;

use App\Events\SellerRegistered;
use App\Models\Business;
use App\Models\Category;
use App\Models\Product;
use App\Models\SellerRegistration;

use App\Models\Wishlist;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

use Inertia\Inertia;

class UserController extends Controller
{
    protected $user_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
    }

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
            "productImage",
            "productVideo",
            "productFeature",
            "productIncludeItem"
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

    public function aboutus()
    {
        return Inertia::render('BuyerPage/AboutUs');
    }

    public function shopping()
    {
        $list_shoppingItem = Product::with([
            'productImage',
            'category'
        ])
            ->paginate(8);

        $list_categoryItem = Category::all();

        return Inertia::render(
            "BuyerPage/ShopPage",
            [
                'list_shoppingItem' => $list_shoppingItem,
                'list_categoryItem' => $list_categoryItem,
            ]
        );
    }

    public function sellerBenefit()
    {
        return Inertia::render("BuyerPage/SellerBenefit");
    }

    public function productDetails($product_id)
    {
        $product_info = Product::with([
            'productImage',
            "productVideo",
            "productFeature",
            "productIncludeItem",
            "productOption",
            "productOption.productOptionValue",
            "seller.sellerStore",
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

    public function sellerShop()
    {
        return Inertia::render('BuyerPage/SellerShop');
    }

    public function wishlist()
    {
        $user_wishlist = Wishlist::with([
            "product",
            "productImage"
        ])
            ->where("user_id", $this->user_id)
            ->get();

        return Inertia::render(
            "BuyerPage/Wishlist",
            [
                "user_wishlist" => $user_wishlist
            ]
        );
    }

    public function profile()
    {
        return Inertia::render("BuyerPage/ProfilePage");
    }

    public function checkout(Request $request)
    {
        $list_product = $request->input("items");

        return Inertia::render(
            'BuyerPage/Checkout',
            [
                "list_product" => $list_product
            ]
        );
    }

    // Function for validate and process the users who want to become a seller in relove market.
    public function sellerRegistrationProcess(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Step 1: Account Info
            'name' => ['required', 'regex:/^[a-zA-Z\s]+$/u'],
            'email' => ['required', 'email'],
            'phoneNumber' => ['required', 'regex:/^[0-9]{9,15}$/'],

            // Step 2: Store Info
            'storeName' => ['required', 'string'],
            'storeLicense' => ['required', 'file', 'mimes:pdf', 'max:5120'],
            'storeDescription' => ['required', 'string'],
            'storeAddress' => ['required', 'string'],
            'storeCity' => ['required', 'string'],
            'storeState' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        // ✅ Generate next registration ID
        $lastSeller = SellerRegistration::orderByRaw("CAST(SUBSTRING(registration_id FROM 7) AS INTEGER) DESC")->first();
        $lastId = $lastSeller ? (int) Str::after($lastSeller->registration_id, 'SELLER') : 0;
        $nextId = $lastId + 1;
        $registrationId = 'SELLER' . str_pad($nextId, 5, '0', STR_PAD_LEFT);


        // ✅ Store license file under folder named by user_id
        if ($request->hasFile('storeLicense')) {
            $file = $request->file('storeLicense');

            // Example: store_licenses/{user_id}/license.pdf
            $filename = 'license_' . $request->storeName . '.' . $file->getClientOriginalExtension();

            // Path will be: storage/app/public/store_licenses/{user_id}/license_timestamp.pdf
            $path = $file->storeAs(
                "store_licenses/{$registrationId}",
                $filename,
                'public'
            );
        }


        $SellerRegistered = SellerRegistration::create([
            'registration_id' => $registrationId,
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phoneNumber,
            'store_name' => $request->storeName,
            'store_license' => $path,
            'store_description' => $request->storeDescription,
            'store_address' => $request->storeAddress,
            'store_city' => $request->storeCity,
            'store_state' => $request->storeState,
            'business_id' => $request->businessType,
            'status' => "Pending",
        ]);

        // Fire the event to make the request update in real time on admin dashboard.
        broadcast(new SellerRegistered($SellerRegistered, "Registered"));

        return redirect(route("homepage"))
            ->with("successMessage", "Registration sucess...Please wait for the approvement");
    }

    public function store_wishlist(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,product_id'
            ]);

            Wishlist::firstOrCreate([
                'user_id' => $this->user_id,
                'product_id' => $request->product_id
            ]);

            return response()->json(['successMessage' => 'Product added to wishlist']);
        } catch (Exception $e) {
            return response()->json(["errorMessage" => $e->getMessage()]);
        }
    }

    public function destroy_wishlist(Request $request)
    {
        try {
            $productIds = $request->input('product_id'); // array from frontend

            if (!is_array($productIds)) {
                $productIds = [$productIds]; // make sure it's an array
            }

            $deletedCount = Wishlist::where('user_id', $this->user_id)
                ->whereIn('product_id', $productIds)
                ->delete();

            if ($deletedCount > 0) {
                return response()->json([
                    'successMessage' => 'Selected products have been removed from wishlist'
                ]);
            }

            return response()->json([
                'errorMessage' => 'Products not found in wishlist'
            ], 404);

        } catch (Exception $e) {
            return response()->json([
                'errorMessage' => $e->getMessage()
            ], 500);
        }
    }
}
