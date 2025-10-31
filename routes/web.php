<?php

use App\Http\Controllers\BuyerPage\HomePageController;
use App\Http\Controllers\BuyerPage\ProductManagementController;
use App\Http\Controllers\BuyerPage\UserController;

use App\Http\Controllers\ProfileController;

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

// General Page that can be access without login
Route::get('/relove-market', [UserController::class, 'homepage'])->name('homepage');
Route::get("/about-us", [UserController::class, 'aboutus'])->name("about-us");
Route::get("/shopping", [UserController::class, 'shopping'])->name("shopping");
Route::get("/seller-benefit", [UserController::class, 'sellerBenefit'])->name("seller-benefit");
Route::get("/product-details/{productId}", [UserController::class, "productDetails"])->name('product-details');

Route::get('/seller-shop', [UserController::class, 'sellerShop'])->name('seller-shop');

// Code for calling the product image based recommendation for user
Route::post("/api/recommend", [ProductManagementController::class, "getRecommendations"])->name("recommend");
Route::post('/camera-search', [HomePageController::class, 'cameraSearch'])->name("camera-search");
Route::get("/api/get-list-products", [ProductManagementController::class, "get_listProducts"]);

// Need to login account and is a buyer can access this all feature
Route::middleware(["is_buyer"])->group(function () {
    Route::get("/seller-registration", [UserController::class, "sellerRegistration"])->name('seller-registration');
    Route::get("/profile", [UserController::class, "profile"])->name("profile");
    Route::get('/wishlist', [UserController::class, 'wishlist'])->name('wishlist');
    Route::get('/buyer-chat', [UserController::class, 'buyerChat'])->name('buyer-chat');

    Route::post('/checkout', [UserController::class, 'checkout'])->name('checkout');

    Route::post("/validate-stock", [PaymentController::class, "validateStock"]);
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/confirm-payment', [PaymentController::class, 'confirmPayment']);
    Route::get('/order/{orderId}', [PaymentController::class, 'getOrder']);
    Route::get('/orders', [PaymentController::class, 'listOrders']);
    Route::get('/order-success', [PaymentController::class, "show_orderSuccess"]);
});

// need to login account and is a seller can access all this feature
Route::middleware(['is_seller'])->group(function () {
    Route::get('/seller-dashboard', [SellerController::class, 'sellerDashboard'])->name('seller-dashboard');
    Route::get("/seller-manage-product", [SellerController::class, "sellerManageProduct"])->name("seller-manage-product");
    Route::get("/seller-manage-order", [SellerController::class, "sellerOrderPage"])->name("seller-manage-order");
    Route::get("/seller-manage-earning", [SellerController::class, "sellerEarningPage"])->name("seller-manage-earning");
    Route::get("/seller-manage-promotion", [SellerController::class, "sellerPromotionPage"])->name("seller-manage-promotion");
    Route::get('/seller-manage-subscription', [SellerController::class, 'sellerSubscriptionPage'])->name("seller-manage-subscription");
    Route::get("/seller-purchase-subscription/{subscription_plan_id}", [SellerController::class, "sellerPurchaseSubscription"])->name("seller-purchase-subscription");
    Route::get("/seller-help-support", [SellerController::class, "sellerHelpSupportPage"])->name("seller-help-support");
    Route::get('/seller-manage-profile', [SellerController::class, 'getProfile'])->name("seller-manage-profile");
    Route::get('/seller-chat', [ChatController::class, "sellerChat"])->name('seller-chat');

    Route::post('/profile-update', [SellerController::class, 'updateProfile']);

    Route::post('/seller-manage-promotion/view-promotion', [SellerController::class, 'sellerViewPromotion'])->name('view-promotion');
    Route::post('/seller-manage-promotion/add-promotion', [SellerController::class, 'sellerAddPromotion'])->name('add-promotion');
    Route::post('/seller-manage-promotion/edit-promotion', [SellerController::class, 'sellerEditPromotion'])->name('edit-promotion');
    Route::post('/seller-manage-promotion/delete-promotion', [SellerController::class, 'sellerDeletePromotion'])->name('delete-promotion');
});

// need to login account and is a admin can access all this feature
Route::middleware(["is_admin"])->group(function () {
    Route::get('/admin-dashboard', [AdminController::class, 'adminDashboard'])->name('admin-dashboard');
    Route::get("/pending-seller-list", [AdminController::class, "pendingSellerTable"])->name("pending-seller-list");
    Route::get("/admin-profile", [AdminController::class, 'profilePage'])->name("admin-profile");
    Route::get("/list-transaction", [AdminController::class, 'transactionPage'])->name("list-transaction");
    Route::get("/subscription-management", [AdminController::class, 'subscriptionManagement'])->name("subscription-management");
    Route::get("/subscription-policy", [AdminController::class, 'subscriptionPolicy'])->name("subscription-policy");
    Route::get("/product-management", [AdminController::class, "productManagement"])->name("product-management");
    Route::get("/user-management", [AdminController::class, "userManagement"])->name("user-management");


    Route::get('/admin/dashboard/pending-seller-list', [AdminController::class, 'getSellerList']);
    Route::post('/admin/pending-seller/{id}/action', [AdminController::class, 'handleAction']);

    // API request for managing the subscription on manage subscriptions page
    Route::get("/api/admin/get-subscriptions", [AdminController::class, "getSubscriptions"]);
    Route::post("/api/admin/create-subscriptions", [AdminController::class, "createSubscriptions"]);
    Route::put("/api/admin/update-subscriptions/{subscription_plan_id}", [AdminController::class, "updateSubscriptions"]);
    Route::delete("/api/admin/delete-subscriptions/{subscription_plan_id}", [AdminController::class, "deleteSubscriptions"]);
    Route::patch("/api/admin/change-subscriptions/{subscriptions_plan_id}/status", [AdminController::class, "updateStatusSubscriptions"]);
});

// code for calling and setting the chat communication between buyer and seller
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::get('/messages/{conversationId}', [ChatController::class, 'getMessages']);
    Route::post('/send-message', [ChatController::class, 'sendMessage']);
    Route::post('/conversations/{conversationId}/mark-read', [ChatController::class, 'markAsRead']);
    Route::post('/start-conversation', [ChatController::class, 'startConversation']);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
