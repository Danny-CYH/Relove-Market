<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Inertia\Inertia;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Mail\SellerApprovedMail;
use App\Mail\SellerRejectedMail;

use App\Models\SellerRegistration;
use App\Models\Seller;
use App\Models\SellerStore;
use App\Models\User;
use App\Models\Role;

class AdminController extends Controller
{
    // function for generate seller ID
    public static function generateSellerId($businessId)
    {
        $year = date('Y');

        $lastSeller = Seller::where('seller_id', $businessId)
            ->whereYear('created_at', $year)
            ->orderBy("seller_id", "desc")
            ->first();

        if ($lastSeller) {
            // Extract the last sequence number
            $lastSequence = intval(substr($lastSeller->seller_id, -3));
            $sequence = str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $sequence = '001';
        }

        return "SELLER-{$businessId}-{$year}-{$sequence}";

        // Format: SELLER-BUS0001-2025-001
    }

    // function for generate store ID
    public static function generateStoreId()
    {
        // Generate store ID (format: STR-0001)
        $lastStore = SellerStore::orderBy('store_id', 'desc')->first();
        $nextNumber = $lastStore ? ((int) substr($lastStore->store_id, 4)) + 1 : 1;
        $storeId = 'STR-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        return $storeId;
    }

    public function adminDashboard()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->take(3)
            ->get();

        return Inertia::render("AdminPage/AdminDashboard", ['list_sellerRegistration' => $list_sellerRegistration]);
    }

    public function transactionPage()
    {
        return Inertia::render("AdminPage/Transactions");
    }

    public function pendingSellerTable()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->paginate(10);

        return Inertia::render("AdminPage/PendingSellerTable", ['list_sellerRegistration' => $list_sellerRegistration]);
    }

    public function profilePage()
    {
        return Inertia::render("AdminPage/ProfilePage");
    }

    public function subscriptionManagement()
    {
        $list_subscription = Subscription::all();

        return Inertia::render(
            "AdminPage/SubscriptionManagement",
            [
                "list_subscription" => $list_subscription,
            ]
        );
    }

    public function subscriptionPolicy()
    {
        return Inertia::render("AdminPage/SubscriptionPolicy");
    }

    public function getSellerList()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->paginate(3);

        return response()->json($list_sellerRegistration);
    }

    public function handleAction(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:Approved,Rejected',
        ]);

        $seller = SellerRegistration::where('registration_id', $id)->firstOrFail();

        $seller->status = $request->action;
        $user_email = $seller->email;

        $seller->save();

        // Send email based on action
        if ($request->action === 'Approved') {
            $store_id = self::generateStoreId();
            $seller_id = self::generateSellerId($seller->business_id);

            $sellerRoleId = Role::where('role_name', 'Seller')->value('role_id');

            SellerStore::create([
                "store_id" => $store_id,
                "store_name" => $seller->store_name,
                "store_description" => $seller->store_description,
                "store_address" => $seller->store_address,
            ]);

            Seller::create([
                "seller_id" => $seller_id,
                "seller_name" => $seller->name,
                "seller_email" => $seller->email,
                "seller_phone" => $seller->phone_number,
                "store_id" => $store_id,
                "business_id" => $seller->business_id,
            ]);

            User::where('email', $user_email)
                ->update(
                    [
                        'seller_id' => $seller_id,
                        'role_id' => $sellerRoleId
                    ]
                );

            Mail::to($seller->email)->send(new SellerApprovedMail($seller));
        } else {
            $reason = $request->reason;

            Mail::to($seller->email)->send(new SellerRejectedMail($seller, $reason));
        }

        return response()->json([
            'successMessage' => "Seller has been {$request->action} successfully.",
        ]);
    }
}
