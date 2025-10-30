<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\User;

use Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProfileManagementController extends Controller
{
    protected $user_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
    }

    // Code for view the order history on profile page.
    public function orderHistory()
    {
        $list_order = Order::with([
            "orderItems.product",
            "orderItems.productImage",
            "orderItems.product.seller.sellerStore",
            "user",
        ])
            ->where("user_id", $this->user_id)
            ->orderBy("created_at", "desc")
            ->get();

        return response()->json($list_order);
    }


    // Code for updating the information and image on profile page.
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
