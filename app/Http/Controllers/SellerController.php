<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Seller;
use App\Models\Promotions;

use Exception;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use Inertia\Inertia;

class SellerController extends Controller
{
    protected $user_id;

    protected $seller_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
        $this->seller_id = session('seller_id');
    }

    public function sellerDashboard()
    {
        return Inertia::render(
            'SellerPage/SellerDashboard'
        );
    }

    public function sellerManageProduct()
    {
        $seller_storeInfo = Seller::with("sellerStore")
            ->where("seller_id", $this->seller_id)
            ->get();

        $list_categories = Category::all();

        return Inertia::render(
            "SellerPage/SellerManageProduct",
            [
                'seller_storeInfo' => $seller_storeInfo,
                'list_categories' => $list_categories,
            ]
        );
    }

    public function sellerOrderPage()
    {
        return Inertia::render("SellerPage/SellerOrderPage");
    }

    public function sellerEarningPage()
    {
        return Inertia::render("SellerPage/SellerEarningPage");
    }

    public function sellerPromotionPage()
    {
        $list_promotion = Promotions::all();

        return Inertia::render(
            "SellerPage/SellerPromotionPage",
            [
                "list_promotion" => $list_promotion
            ]
        );
    }

    public function sellerHelpSupportPage()
    {
        return Inertia::render("SellerPage/SellerHelpSupportPage");
    }

    public function sellerAddPromotion(Request $request)
    {
        try {
            // ✅ Validate request
            $validated = $request->validate([
                'promotion_name' => 'required|string|max:255',
                'promotion_discount' => 'required|string|max:50', // can be percentage or text like "BOGO"
                'promotion_type' => 'required|in:Flash Sale,Voucher,Free Shipping',
                'promotion_startDate' => 'required|date|before:promotion_endDate',
                'promotion_endDate' => 'required|date|after:promotion_startDate',
                'promotion_status' => 'required|in:Active,Paused,Expired',
                'promotion_usage' => 'nullable|integer|min:1',
                'promotion_badge' => 'nullable|string|max:50',
            ]);

            // ✅ Create promotion
            Promotions::create([
                'promotion_id' => Str::uuid()->toString(),
                'promotion_name' => $validated['promotion_name'],
                'promotion_discount' => $validated['promotion_discount'],
                'promotion_type' => $validated['promotion_type'],
                'promotion_startDate' => $validated['promotion_startDate'],
                'promotion_endDate' => $validated['promotion_endDate'],
                'promotion_status' => $validated['promotion_status'],
                'promotion_limit' => $validated['promotion_usage'] ?? null,
            ]);

            return response()->json([
                "successMessage" => "Promotion Created Successfully!"
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    public function sellerEditPromotion(Request $request)
    {

    }
    public function sellerDeletePromotion(Request $request)
    {

    }
    public function sellerViewPromotion(Request $request)
    {

    }

    public function getProfile()
    {
        try {
            $seller_storeInfo = Seller::with([
                "sellerStore"
            ])
                ->where("seller_id", $this->seller_id)
                ->get();

            return Inertia::render("SellerPage/SellerUpdateProfile", [
                "seller_storeInfo" => $seller_storeInfo
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile data'
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $seller = Auth::user();
            $store = $seller->seller_store;

            // Validate personal information
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $seller->id,
                'phone' => 'nullable|string|max:20',
                'store_name' => 'required|string|max:255',
                'store_description' => 'nullable|string',
                'store_address' => 'nullable|string',
                'store_phone' => 'nullable|string|max:20',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
                'store_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            // Update user information
            $seller->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
            ]);

            // Update or create store information
            if ($store) {
                $storeData = [
                    'store_name' => $request->store_name,
                    'store_description' => $request->store_description,
                    'store_address' => $request->store_address,
                    'store_phone' => $request->store_phone,
                ];

                // Handle profile image upload
                if ($request->hasFile('profile_image')) {
                    // Delete old image if exists
                    if ($seller->profile_image) {
                        Storage::delete(str_replace('/storage/', 'public/', $seller->profile_image));
                    }

                    $path = $request->file('profile_image')->store('public/sellers/profile');
                    $seller->update(['profile_image' => '/storage/' . str_replace('public/', '', $path)]);
                }

                // Handle store image upload
                if ($request->hasFile('store_image')) {
                    // Delete old image if exists
                    if ($store->store_image) {
                        Storage::delete(str_replace('/storage/', 'public/', $store->store_image));
                    }

                    $path = $request->file('store_image')->store('public/stores');
                    $storeData['store_image'] = '/storage/' . str_replace('public/', '', $path);
                }

                $store->update($storeData);
            }

            $seller->load('seller_store');

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'seller' => $seller
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }
}
