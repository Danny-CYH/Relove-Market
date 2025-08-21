<?php

namespace App\Http\Controllers;

use App\Events\SellerRegistered;
use App\Models\Business;

use App\Models\Category;
use App\Models\Product;
use App\Models\SellerRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

use Inertia\Inertia;

class UserController extends Controller
{
    public function homepage()
    {
        return Inertia::render(
            'BuyersPage/HomePage',
            [
                'title' => 'Homepage',
                'description' => 'Welcome to the homepage of our application.',
            ]
        );
    }

    public function aboutus()
    {
        return Inertia::render('BuyersPage/AboutUs');
    }

    public function shopping()
    {
        $list_shoppingItem = Product::with(['productImage', 'category'])->paginate(8);
        $list_categoryItem = Category::all();

        return Inertia::render(
            "BuyersPage/ShopPage",
            [
                'list_shoppingItem' => $list_shoppingItem,
                'list_categoryItem' => $list_categoryItem,
            ]
        );
    }

    public function becomeSeller()
    {
        return Inertia::render("BuyersPage/BecomeSeller");
    }

    public function itemDetails($product_id)
    {
        $product_info = Product::with('productImage')->where('product_id', $product_id)->get();

        return Inertia::render(
            "BuyersPage/ItemDetails",
            [
                'product_info' => $product_info,
            ]
        );
    }

    public function buyerDashboard()
    {
        return Inertia::render('BuyersPage/BuyerDashboard');
    }

    public function buyerChat()
    {
        return Inertia::render('BuyersPage/BuyerChatPage');
    }

    public function sellerRegistration()
    {
        $list_business = Business::all();

        return Inertia::render(
            "BuyersPage/SellerRegistration",
            [
                'list_business' => $list_business
            ]
        );
    }

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


        SellerRegistration::create([
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

        // Broadcast the registration on admin dashboard
        event(
            new SellerRegistered(
                SellerRegistration::with('business')->first()
            )
        );

        return redirect('/relove-market')->with("successMessage", "Registration sucess...Please wait for the approvement");
    }

    public function sellerShop()
    {
        return Inertia::render('BuyersPage/SellerShop');
    }

    public function wishlist()
    {
        return Inertia::render("BuyersPage/Wishlist");
    }

    public function checkout()
    {
        return Inertia::render('BuyersPage/Checkout');
    }
}
