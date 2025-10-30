<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;

use App\Events\SellerRegistered;
use App\Models\SellerRegistration;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SellerRegistrationController extends Controller
{
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
}
