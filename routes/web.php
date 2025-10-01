<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChatController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin section
Route::middleware(["is_admin"])->group(function () {
    Route::get('/admin-dashboard', [AdminController::class, 'adminDashboard'])->name('admin-dashboard');
    Route::get("/pending-seller-list", [AdminController::class, "pendingSellerTable"])->name("pending-seller-list");
    Route::get("/admin-profile", [AdminController::class, 'profilePage'])->name("admin-profile");
    Route::get("/list-transaction", [AdminController::class, 'transactionPage'])->name("list-transaction");
    Route::get("/subscription-management", [AdminController::class, 'subscriptionManagement'])->name("subscription-management");
    Route::get("/subscription-policy", [AdminController::class, 'subscriptionPolicy'])->name("subscription-policy");
    Route::get("/user-management", [AdminController::class, "userManagement"])->name("user-management");

    Route::get('/admin/dashboard/pending-seller-list', [AdminController::class, 'getSellerList']);
    Route::get("/admin/user-management/list", [AdminController::class, "getUserList"])->name("list-user");
    Route::post('/admin/pending-seller/{id}/action', [AdminController::class, 'handleAction']);

    // API request for managing the subscription on manage subscriptions page
    Route::get("/api/admin/get-subscriptions", [AdminController::class, "getSubscriptions"]);
    Route::post("/api/admin/create-subscriptions", [AdminController::class, "createSubscriptions"]);
    Route::put("/api/admin/update-subscriptions/{subscription_plan_id}", [AdminController::class, "updateSubscriptions"]);
    Route::delete("/api/admin/delete-subscriptions/{subscription_plan_id}", [AdminController::class, "deleteSubscriptions"]);
    Route::patch("/api/admin/change-subscriptions/{subscriptions_plan_id}/status", [AdminController::class, "updateStatusSubscriptions"]);
});

// need to login account and is a seller can access all this feature
Route::middleware(['is_seller'])->group(function () {
    Route::get('/seller-dashboard', [SellerController::class, 'sellerDashboard'])->name('seller-dashboard');
    Route::get("/seller-manage-product", [SellerController::class, "sellerManageProduct"])->name("seller-manage-product");
    Route::get("/seller-manage-order", [SellerController::class, "sellerOrderPage"])->name("seller-manage-order");
    Route::get("/seller-manage-earning", [SellerController::class, "sellerEarningPage"])->name("seller-manage-earning");
    Route::get("/seller-manage-promotion", [SellerController::class, "sellerPromotionPage"])->name("seller-manage-promotion");
    Route::get('/seller-manage-subscription', [SellerController::class, 'sellerSubscriptionPage'])->name("seller-manage-subscription");
    Route::get("/seller-help-support", [SellerController::class, "sellerHelpSupportPage"])->name("seller-help-support");

    Route::get('/seller-chat', [ChatController::class, "sellerChat"])->name('seller-chat');

    Route::get("/seller-manage-product/get-product", [SellerController::class, "get_ListProduct"])->name('get-product');
    Route::post('/seller-manage-product/add-product', [SellerController::class, 'sellerAddProduct'])->name('add-product');
    Route::post('/seller-manage-product/edit-product', [SellerController::class, 'sellerEditProduct'])->name('edit-product');
    Route::post('/seller-manage-product/delete-product', [SellerController::class, 'sellerDeleteProduct'])->name('delete-product');

    Route::post('/seller-manage-promotion/view-promotion', [SellerController::class, 'sellerViewPromotion'])->name('view-promotion');
    Route::post('/seller-manage-promotion/add-promotion', [SellerController::class, 'sellerAddPromotion'])->name('add-promotion');
    Route::post('/seller-manage-promotion/edit-promotion', [SellerController::class, 'sellerEditPromotion'])->name('edit-promotion');
    Route::post('/seller-manage-promotion/delete-promotion', [SellerController::class, 'sellerDeletePromotion'])->name('delete-promotion');
});

// need to login account and is a buyer can access this all feature
Route::middleware(["is_buyer"])->group(function () {
    Route::get("/profile", [UserController::class, "profile"])->name("profile");

    Route::get('/wishlist', [UserController::class, 'wishlist'])->name('wishlist');
    Route::post('/wishlist', [UserController::class, 'store_wishlist'])->name("store-wishlist");
    Route::post('/wishlist/remove', [UserController::class, 'destroy_wishlist'])->name("destroy-wishlist");

    Route::post('/checkout', [UserController::class, 'checkout'])->name('checkout');
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);

    Route::get('/buyer-chat', [ChatController::class, 'buyerChat'])->name('buyer-chat');
});

// chat page role (need to minimize)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::get('/messages/{conversationId}', [ChatController::class, 'getMessages']);
    Route::post('/send-message', [ChatController::class, 'sendMessage']);
    Route::post('/conversations/{conversationId}/mark-read', [ChatController::class, 'markAsRead']);
    Route::post('/start-conversation', [ChatController::class, 'startConversation']);
});

// General Page that can be access without login
Route::get('/relove-market', [UserController::class, 'homepage'])->name('homepage');
Route::get("/about-us", [UserController::class, 'aboutus'])->name("about-us");
Route::get("/shopping", [UserController::class, 'shopping'])->name("shopping");
Route::get("/seller-benefit", [UserController::class, 'sellerBenefit'])->name("seller-benefit");
Route::get("/product-details/{productId}", [UserController::class, "productDetails"])->name('product-details');

Route::get("/seller-registration", [UserController::class, "sellerRegistration"])->name('seller-registration');
Route::get('/seller-shop', [UserController::class, 'sellerShop'])->name('seller-shop');

Route::post('/seller-registration-process', [UserController::class, 'sellerRegistrationProcess'])->name("seller-registration-process");
Route::post("/recommend", [UserController::class, "getRecommendations"])->name("recommend");



require __DIR__ . '/auth.php';
