<?php

namespace App\Http\Controllers\BuyerPage;

use App\Events\SellerRegistered;
use App\Http\Controllers\Controller;

use App\Events\BuyerPage\ProductDetails\ReviewsUpdate;

use App\Models\Order;
use App\Models\Product;
use App\Models\Rating;
use App\Models\SellerRegistration;
use App\Models\User;
use App\Models\Wishlist;

use Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ManageActionController extends Controller
{
    protected $user_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
    }

    public function get_featuredProducts()
    {
        $featured_products = Product::with([
            "ratings",
            'category',
            "productImage"
        ])
            ->where("featured", true)
            ->get();

        return response()->json([
            "featured_products" => $featured_products
        ]);
    }

    public function get_flashSaleProducts()
    {
        $flash_sale_products = Product::with([
            "productImage"
        ])
            ->where("flash_sale", true)
            ->get();

        return response()->json([
            "flash_sale_products" => $flash_sale_products
        ]);
    }

    public function get_listProducts()
    {
        $list_products = Product::with([
            "category",
            "ratings",
            "productImage"
        ])->paginate(6);

        return response()->json([
            "list_products" => $list_products
        ]);
    }

    // Code for calling the similar product based on product image
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
            [
                "productImage",
                "productVideo",
                "productFeature",
                "productIncludeItem",
                "ratings",
                "category",
            ]

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

    // Code for getting all the wishlist item for specific user
    public function get_allWishlist()
    {
        $all_wishlist = Wishlist::with([
            "product",
            "productImage",
            "ratings",
            "productVariant",
        ])
            ->where("user_id", $this->user_id)
            ->get();

        return response()->json(
            $all_wishlist
        );
    }

    // Code for validate that did the user have ever like the product before
    public function get_wishlist($product_id)
    {
        try {
            $is_wishlisted = Wishlist::where(
                "product_id",
                $product_id
            )
                ->where("user_id", $this->user_id)
                ->first();

            if ($is_wishlisted != null) {
                return response()->json([
                    "is_wishlisted" => true
                ]);
            }

            return response()->json([
                "is_wishlisted" => false
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    // Code for storing the product as a wishlist
    public function store_wishlist(Request $request)
    {
        $product_id = $request->input("product_id");

        try {
            $wishlistData = [
                'user_id' => $this->user_id,
                'product_id' => $product_id,
            ];

            // Add variant data if provided
            if ($request->has('selected_variant')) {
                $wishlistData['selected_variant'] = json_encode($request->selected_variant);
            }

            // Check if already in wishlist
            $existingWishlist = Wishlist::where('user_id', $this->user_id)
                ->where('product_id', $product_id)
                ->first();

            if ($existingWishlist) {
                // Update existing wishlist item with new variant/options
                $existingWishlist->update($wishlistData);
            } else {
                // Create new wishlist item
                Wishlist::create($wishlistData);
            }

            return response()->json([
                'successMessage' => 'Product added to wishlist',
                "data" => $wishlistData
            ]);
        } catch (Exception $e) {
            return response()->json(["errorMessage" => $e->getMessage()]);
        }
    }

    // Code for removing the product from wishlist (Can removed more than 1 at one time)
    public function remove_wishlist(Request $request)
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

    // Code for user to make a review and comment on the product and store in the database.
    public function make_review(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,product_id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:1000',
            ]);

            $review = Rating::create([
                'product_id' => $validated['product_id'],
                'user_id' => $this->user_id, // or $request->user_id if passed
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]);

            $review->load("user");

            // Broadcast event
            broadcast(new ReviewsUpdate($review));

            return response()->json([
                'message' => 'Review submitted successfully.',
                'review' => $review
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    public function orderHistory()
    {
        $list_order = Order::with([
            "orderItems.product",
            "orderItems.productImage"
        ])
            ->where("user_id", $this->user_id)
            ->orderBy("created_at", "desc")
            ->get();

        return response()->json($list_order);
    }


    public function updateProfile(Request $request)
    {
        try {
            Log::info('🎯 Profile update request received', [
                'all_data' => $request->all(),
                'files' => $request->file() ? array_keys($request->file()) : 'no files',
                'has_profile_image' => $request->hasFile('profile_image') ? 'yes' : 'no',
            ]);

            // ✅ Validate input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'zip_code' => 'nullable|string|max:10',
                'profile_image' => 'nullable|file|mimes:jpg,jpeg,png|max:9999',
            ]);

            if ($validator->fails()) {
                Log::error('❌ Validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();
            Log::info('✅ Validation passed', $validated);

            // ✅ Find user by email
            $user = User::where('email', $validated['email'])->first();

            if (!$user) {
                Log::error('❌ User not found with email: ' . $validated['email']);
                return response()->json([
                    'success' => false,
                    'message' => 'User not found with this email.',
                ], 404);
            }

            Log::info('✅ User found', ['user_id' => $user->user_id, 'email' => $user->email]);

            // ✅ Handle profile image upload
            if ($request->hasFile('profile_image')) {
                Log::info('📁 Profile image file detected', [
                    'file_name' => $request->file('profile_image')->getClientOriginalName(),
                    'file_size' => $request->file('profile_image')->getSize(),
                    'file_mime' => $request->file('profile_image')->getMimeType(),
                ]);

                $image = $request->file('profile_image');
                $directory = "profile_images/{$user->user_id}";

                Log::info('📂 Attempting to store in directory: ' . $directory);

                // Create directory if it doesn't exist
                if (!Storage::disk('public')->exists($directory)) {
                    Log::info('📁 Creating directory: ' . $directory);
                    $created = Storage::disk('public')->makeDirectory($directory);
                    Log::info('📁 Directory created: ' . ($created ? 'yes' : 'no'));
                }

                // Generate unique filename
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                Log::info('📝 Generated filename: ' . $filename);

                // Store the file
                $path = $image->storeAs($directory, $filename, 'public');

                Log::info('💾 File stored at path: ' . $path);

                if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
                    Storage::disk('public')->delete($user->profile_image);
                }

                if ($path) {
                    $validated['profile_image'] = $path;
                    Log::info('✅ Profile image path saved: ' . $path);

                    // Check if file actually exists
                    $fileExists = Storage::disk('public')->exists($path);
                    Log::info('🔍 File exists in storage: ' . ($fileExists ? 'yes' : 'no'));
                } else {
                    Log::error('❌ Failed to store profile image');
                }
            } else {
                Log::info('📭 No profile image file in request');
            }

            // ✅ Update the user's data
            Log::info('🔄 Updating user data', $validated);
            $user->update($validated);

            Log::info('✅ User updated successfully');

            // Refresh user data
            $user->refresh();

            // Prepare user data for response
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'city' => $user->city,
                'zip_code' => $user->zip_code,
                'profile_image' => $user->profile_image,
            ];

            // Add full URL if profile image exists
            if ($user->profile_image) {
                $userData['profile_image_url'] = asset('storage/' . $user->profile_image);
                Log::info('🌐 Profile image URL: ' . $userData['profile_image_url']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully!',
                'user' => $userData,
            ]);

        } catch (Exception $e) {
            Log::error('💥 Profile update error: ' . $e->getMessage());
            Log::error('📝 Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Error updating profile: ' . $e->getMessage(),
            ], 500);
        }
    }
}
