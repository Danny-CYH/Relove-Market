<?php

namespace App\Http\Controllers;

use App\Models\Business;

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
        return Inertia::render('BuyersPage/HomePage', [
            'title' => 'Homepage',
            'description' => 'Welcome to the homepage of our application.',
        ]);
    }

    public function aboutus()
    {
        return Inertia::render('BuyersPage/AboutUs');
    }

    public function shopping()
    {
        return Inertia::render("BuyersPage/ShopPage");
    }

    public function itemDetails()
    {
        return Inertia::render("BuyersPage/ItemDetails");
    }

    public function sellerRegistration()
    {
        $list_business = Business::all();

        return Inertia::render("BuyersPage/SellerRegistration", ['list_business' => $list_business]);
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
        $lastSeller = SellerRegistration::orderBy('registration_id', 'desc')->first();
        $lastId = $lastSeller ? (int) Str::after($lastSeller->registration_id, 'SELLER') : 0;
        $nextId = $lastId + 1;
        $registrationId = 'SELLER' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        if ($request->hasFile('storeLicense')) {
            $file = $request->file('storeLicense');
            $filename = time() . '_' . $file->getClientOriginalName(); // optional: add unique prefix
            $path = $file->storeAs('store_licenses', $filename, 'public'); // stored in storage/app/public/store_licenses
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
