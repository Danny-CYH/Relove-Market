<?php

namespace App\Http\Controllers;

use App\Events\AdminPage\Manage_Subscriptions\SubscriptionCreated;
use App\Events\AdminPage\Manage_Subscriptions\SubscriptionDeleted;
use App\Events\AdminPage\Manage_Subscriptions\SubscriptionStatusUpdated;
use App\Events\AdminPage\Manage_Subscriptions\SubscriptionUpdated;
use App\Events\SellerRegistered;

use App\Models\Order;
use App\Models\SellerRegistration;
use App\Models\Seller;
use App\Models\SellerStore;
use App\Models\User;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\SubscriptionFeatures;

use Exception;
use Inertia\Inertia;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

use App\Mail\SellerApprovedMail;
use App\Mail\SellerRejectedMail;

use Carbon\Carbon;

use Validator;

class AdminController extends Controller
{
    // function for generate seller ID
    public static function generateSellerId($businessId)
    {
        $year = Carbon::now()->year;

        // Find the latest seller_id for this business and year
        $latest = DB::table('sellers')
            ->where('business_id', $businessId)
            ->whereRaw("seller_id LIKE ?", ["SELLER-{$businessId}-{$year}-%"])
            ->orderByDesc('seller_id')
            ->value('seller_id');

        if ($latest) {
            // Extract the last sequence
            $lastSequence = (int) substr($latest, -3); // last 3 digits
            $nextSequence = str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $nextSequence = "001";
        }

        return "SELLER-{$businessId}-{$year}-{$nextSequence}";
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

    // Function for get the pending seller data on pending seller table page
    public function getSellerList(Request $request)
    {
        // Read params from the URL query
        $perPage = $request->get('per_page', 3);      // Default 3 items per page
        $status = $request->get('status', null);     // Status filter
        $search = $request->get('search', null);     // Search filter

        // Base query
        $query = SellerRegistration::with('business');

        // Apply status filter (only if not "All")
        if ($status && strtolower($status) !== 'all') {
            $query->where('status', $status);
        }

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Paginate results
        $list_sellerRegistration = $query->paginate($perPage);

        return response()->json($list_sellerRegistration);
    }

    // Function for approve or reject the incoming seller request
    public function handleAction(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:Approved,Rejected',
        ]);

        $sellerRegistered = SellerRegistration::where('registration_id', $id)
            ->firstOrFail();

        $sellerRegistered->status = $request->action;
        $user_email = $sellerRegistered->email;

        $sellerRegistered->save();

        // Send email based on action
        if ($request->action === 'Approved') {
            $store_id = self::generateStoreId();
            $seller_id = self::generateSellerId($sellerRegistered->business_id);

            $sellerRoleId = Role::where('role_name', 'Seller')
                ->value('role_id');

            SellerStore::create([
                "store_id" => $store_id,
                "store_name" => $sellerRegistered->store_name,
                "store_description" => $sellerRegistered->store_description,
                "store_address" => $sellerRegistered->store_address,
            ]);

            Seller::create([
                "seller_id" => $seller_id,
                "seller_name" => $sellerRegistered->name,
                "seller_email" => $sellerRegistered->email,
                "seller_phone" => $sellerRegistered->phone_number,
                "store_id" => $store_id,
                "business_id" => $sellerRegistered->business_id,
                "is_verified" => True,
            ]);

            User::where('email', $user_email)
                ->update(
                    [
                        'seller_id' => $seller_id,
                        'role_id' => $sellerRoleId
                    ]
                );

            // trigger event for instantly update the data on page
            broadcast(new SellerRegistered($sellerRegistered, "Approved"));

            Mail::to($sellerRegistered->email)->send(new SellerApprovedMail($sellerRegistered));

            return response()->json([
                'successMessage' => "Seller has been approved successfully.",
            ]);
        } else {
            $reason = $request->reason;

            // trigger event for instantly update the data on page
            broadcast(new SellerRegistered($sellerRegistered, "Rejected"));

            Mail::to($sellerRegistered->email)->send(new SellerRejectedMail($sellerRegistered, $reason));

            return response()->json([
                'successMessage' => "Seller has been rejected successfully.",
            ]);
        }
    }

    public function adminDashboard()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->take(3)
            ->get();

        return Inertia::render(
            "AdminPage/AdminDashboard",
            [
                'list_sellerRegistration' => $list_sellerRegistration
            ]
        );
    }

    public function transactionPage()
    {
        $list_transactions = Order::with([
            "user",
            "seller",
            "orderItems.product",
            "sellerEarning"
        ])
            ->paginate(5);

        return Inertia::render("AdminPage/Transactions", [
            "list_transactions" => $list_transactions
        ]);
    }

    public function pendingSellerTable()
    {
        return Inertia::render("AdminPage/PendingSellerTable");
    }

    public function profilePage()
    {
        return Inertia::render("AdminPage/ProfilePage");
    }

    public function productModeration()
    {
        return Inertia::render("AdminPage/ProductModeration");
    }

    public function userManagement()
    {
        return Inertia::render("AdminPage/UserManagement");
    }
}
