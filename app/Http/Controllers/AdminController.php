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

    // Function for generate the feature ID for subscription features
    private static function generateFeatureId($prefix = 'FTR-', $padLength = 5)
    {
        $latestFeature = SubscriptionFeatures::orderBy('feature_id', 'desc')->first();

        $number = 1;
        if ($latestFeature && preg_match("/{$prefix}(\d+)/", $latestFeature->feature_id, $matches)) {
            $number = (int) $matches[1] + 1;
        }

        return $prefix . str_pad($number, $padLength, '0', STR_PAD_LEFT);
    }

    // Function for generate unique subscription plan ID like PLAN-00001
    private static function generatePlanId($prefix = 'PLAN-', $padLength = 5)
    {
        $latestPlan = Subscription::orderBy('subscription_plan_id', 'desc')->first();

        $number = 1;
        if ($latestPlan && preg_match("/{$prefix}(\d+)/", $latestPlan->subscription_plan_id, $matches)) {
            $number = (int) $matches[1] + 1;
        }

        return $prefix . str_pad($number, $padLength, '0', STR_PAD_LEFT);
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

    // Function for retrieve the list subscriptions.
    public function getSubscriptions()
    {
        try {
            // Get all subscriptions with features
            $subscriptions = Subscription::with('subscriptionFeatures')->paginate(6);

            // Decode limits for each subscription in the collection
            $subscriptions->getCollection()->transform(function ($item) {
                if (is_string($item->limits)) {
                    $item->limits = json_decode($item->limits, true);
                }
                return $item;
            });

            return response()->json([
                'subscription' => $subscriptions
            ]);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Subscription not found',
                'details' => $e->getMessage(),
            ], 404);
        }
    }

    // Function for create new subscriptions
    public function createSubscriptions(Request $request)
    {
        $validated = $request->validate([
            'plan_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'duration' => 'required|integer|min:1',
            'status' => 'required|string|in:Active,Inactive',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'limits' => 'required|array' // Now we expect array
        ]);

        // ✅ Already array, no decoding needed
        $limits = $validated['limits'];

        // Validate limits structure
        $limitsValidation = Validator::make($limits, [
            'max_products' => 'required|integer|min:0',
            'max_conversations' => 'required|integer|min:0',
            'featured_listing' => 'required|boolean'
        ]);

        if ($limitsValidation->fails()) {
            return response()->json([
                'error' => 'Invalid limits data',
                'details' => $limitsValidation->errors()
            ], 422);
        }

        DB::beginTransaction();

        $subscription_plan_id = $this->generatePlanId();

        try {
            $subscription = Subscription::create([
                'subscription_plan_id' => $subscription_plan_id,
                'plan_name' => $validated['plan_name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'duration' => $validated['duration'],
                'status' => $validated['status'],
                'limits' => json_encode($limits) // Store as JSON string in DB
            ]);

            // Create features
            if (!empty($validated['features'])) {
                foreach ($validated['features'] as $feature) {
                    if (!empty(trim($feature))) {
                        SubscriptionFeatures::create([
                            'subscription_plan_id' => $subscription_plan_id,
                            'feature_id' => $this->generateFeatureId(),
                            'feature_text' => trim($feature),
                        ]);
                    }
                }
            }

            $subscription->load('subscriptionFeatures');

            DB::commit();

            broadcast(new SubscriptionCreated($subscription));

            return response()->json([
                'message' => 'Subscription created successfully!',
                'subscription' => $subscription
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create subscription',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    // Function for update the existing subscriptions
    public function updateSubscriptions(Request $request, $subscription_plan_id)
    {
        // 🔹 Validate input
        $validated = $request->validate([
            'plan_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'status' => 'required|string|in:Active,Inactive',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'limits' => 'required|array' // JSON string containing limits
        ]);

        // ✅ Already array, no decoding needed
        $limits = $validated['limits'];

        // Validate limits structure
        $limitsValidation = Validator::make($limits, [
            'max_products' => 'required|integer|min:0',
            'max_conversations' => 'required|integer|min:0',
            'featured_listing' => 'required|boolean'
        ]);

        if ($limitsValidation->fails()) {
            return response()->json([
                'error' => 'Invalid limits data',
                'details' => $limitsValidation->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // 🔹 Find subscription by its custom ID
            $subscription = Subscription::where('subscription_plan_id', $subscription_plan_id)
                ->first();

            // 🔹 Update subscription record with limits
            $subscription->update([
                'plan_name' => $validated['plan_name'],
                'description' => $validated['description'] ?? $subscription->description,
                'price' => $validated['price'],
                'duration' => $validated['duration'],
                'status' => $validated['status'],
                'limits' => json_encode($limits) // Update limits
            ]);

            // 🔹 Replace features
            if (isset($validated['features'])) {
                // 1. Delete old features
                SubscriptionFeatures::where('subscription_plan_id', $subscription->subscription_plan_id)
                    ->delete();

                // 2. Insert new features
                foreach ($validated['features'] as $featureText) {
                    if (!empty(trim($featureText))) {
                        \Log::info("Inserting feature: " . $featureText);   // debug log

                        SubscriptionFeatures::create([
                            'subscription_plan_id' => $subscription->subscription_plan_id,
                            'feature_id' => $this->generateFeatureId(),
                            'feature_text' => trim($featureText),
                        ]);
                    }
                }
            }

            DB::commit();

            // Broadcast event
            broadcast(new SubscriptionUpdated($subscription));

            return response()->json([
                'message' => 'Subscription updated successfully!',
                'subscription' => $subscription,
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to update subscription',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    // Function for delete the existing subbscriptions
    public function deleteSubscriptions($subscription_plan_id)
    {
        DB::beginTransaction();

        try {
            // Find subscription
            $subscription = Subscription::with("subscriptionFeatures")
                ->where("subscription_plan_id", $subscription_plan_id)
                ->firstOrFail();

            // ✅ FIRST: Delete all subscription features
            SubscriptionFeatures::where('subscription_plan_id', $subscription_plan_id)
                ->delete();

            // Delete the subscription itself
            $subscription->delete();

            DB::commit();

            // Broadcast event
            broadcast(new SubscriptionDeleted($subscription_plan_id));

            return response()->json([
                "successMessage" => "Subscription deleted successfully"
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                "errorMessage" => $e->getMessage()
            ], 500);
        }
    }

    // Functions for active or inactive the subscriptions
    public function updateStatusSubscriptions(Request $request, $subscription_plan_id)
    {
        DB::beginTransaction();

        try {
            // 🔹 Validate input
            $validated = $request->validate([
                'status' => 'required|string|in:Active,Inactive',
            ]);

            // 🔹 Find subscription
            $subscription = Subscription::where('subscription_plan_id', $subscription_plan_id)
                ->firstOrFail();

            // 🔹 Update status
            $subscription->update([
                'status' => $validated['status'],
            ]);

            DB::commit();

            // Broadcast event
            broadcast(new SubscriptionStatusUpdated($subscription));

            return response()->json([
                'successMessage' => "Subscription {$validated['status']} successfully!"
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'errorMessage' => $e->getMessage()
            ], 500);
        }
    }

    // Function for approve or reject the incoming seller request
    public function handleAction(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:Approved,Rejected',
        ]);

        $sellerRegistered = SellerRegistration::where('registration_id', $id)
            ->firstOrFail();

        $trial_mode = Subscription::where("subscription_plan_id", "PLAN-TRIAL")
            ->first();

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
                "subscription_plan_id" => $trial_mode->subscription_plan_id
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
            "orderItems.product"
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

    public function subscriptionManagement()
    {
        return Inertia::render(
            "AdminPage/SubscriptionManagement"
        );
    }

    public function subscriptionPolicy()
    {
        return Inertia::render("AdminPage/SubscriptionPolicy");
    }

    public function productManagement()
    {
        return Inertia::render("AdminPage/ProductManagement");
    }

    public function userManagement()
    {
        return Inertia::render("AdminPage/UserManagement");
    }
}
