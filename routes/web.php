<?php

use App\Http\Controllers\BuyerPage\HomePageController;
use App\Http\Controllers\BuyerPage\ProductManagementController;
use App\Http\Controllers\BuyerPage\UserController;

use App\Http\Controllers\SellerPage\SellerController;
use App\Http\Controllers\AdminPage\AdminController;

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ChatController;

use Illuminate\Support\Facades\Route;

/**
 * TODO: Need to applied the version of the API (v1, v2, v3) for the future development.
 * TODO: Need to refactor some of the controller function and route name
 */

Route::get('/', function () {
    return redirect()->route('homepage');
});

// * General Page that can be access without login
Route::get('/relove-market', [UserController::class, 'homepage'])->name('homepage');
Route::get("/relove-market/about-us", [UserController::class, 'aboutus'])->name("relove-market.about-us");
Route::get("/relove-market/shopping", [UserController::class, 'shopping'])->name("relove-market.shopping");
Route::get("/relove-market/seller-benefit", [UserController::class, 'sellerBenefit'])->name("relove-market.seller-benefit");
Route::get("/relove-market/product-details/{productId}", [UserController::class, "productDetails"])->name('relove-market.product-details');
Route::get('/relove-market/seller-shop', [UserController::class, 'sellerShop'])->name('relove-market.seller-shop');

Route::get('/api/shopping/category-counts', [ProductManagementController::class, 'getCategoryCounts']);
Route::get('/api/shopping', [ProductManagementController::class, 'shoppingApi']);

// * Code for calling the product image based recommendation for user
Route::post("/api/recommend", [ProductManagementController::class, "getRecommendations"])->name("recommend");
Route::post('/camera-search', [HomePageController::class, 'cameraSearch'])->name("camera-search");

// * Code for calling the featured and flash sale products on the home page
Route::get("/get-featured-products", [HomePageController::class, "get_featuredProducts"])->name("get-featured-products");
Route::get("/get-flash-sale-products", [HomePageController::class, "get_flashSaleProducts"])->name("get-flash-sale-products");

// * Need to login account and is a buyer can access this all feature
Route::middleware(["is_buyer"])->group(function () {
    Route::get("/relove-market/seller-registration", [UserController::class, "sellerRegistration"])->name('relove-market.seller.registration');
    Route::get("/relove-market/profile", [UserController::class, "profile"])->name("relove-market.profile");
    Route::get('/relove-market/cart', [UserController::class, 'wishlist'])->name('relove-market.cart');
    Route::get('/relove-market/chat', [UserController::class, 'buyerChat'])->name('relove-market.chat');

    Route::get('/checkout', [UserController::class, 'checkoutPage'])->name('checkout');
    Route::post('/checkout/process', [UserController::class, 'checkoutProcess'])->name('checkout.process');
    Route::post("/validate-stock", [PaymentController::class, "validateStock"])->name("validate-stock");
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent'])->name('create-payment-intent');
    Route::post('/confirm-payment', [PaymentController::class, 'confirmPayment'])->name('confirm-payment');
    Route::get('/order/{orderId}', [PaymentController::class, 'getOrder'])->name('get-order');
    Route::get('/orders', [PaymentController::class, 'listOrders'])->name('list-orders');
    Route::get('/order-success', [PaymentController::class, "show_orderSuccess"])->name("order-success");
});

// need to login account and is a seller can access all this feature
Route::middleware(['is_seller'])->group(function () {
    Route::get('/relove-market/seller/dashboard', [SellerController::class, 'dashboard'])->name('seller.dashboard');
    Route::get("/relove-market/seller/manage-product", [SellerController::class, "manageProducts"])->name("seller.manage.products");
    Route::get("/relove-market/seller/manage-order", [SellerController::class, "manageOrders"])->name("seller.manage.order");
    Route::get("/relove-market/seller/manage-earning", [SellerController::class, "manageEarnings"])->name("seller.manage.earning");
    Route::get("/relove-market/seller/help-support", [SellerController::class, "helpSupport"])->name("seller.help-support");
    Route::get('/relove-market/seller/manage-profile', [SellerController::class, 'profile'])->name("seller.manage.profile");
    Route::get('/relove-market/seller/chat', [ChatController::class, "chat"])->name('seller.chat');
});

// need to login account and is a admin can access all this feature
Route::middleware(["is_admin"])->group(function () {
    Route::get('/relove-market/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get("/relove-market/admin/pending-seller-list", [AdminController::class, "pendingSeller"])->name("admin.pending-seller-list");
    Route::get("/relove-market/admin/profile", [AdminController::class, 'profile'])->name("admin.profile");
    Route::get("/relove-market/admin/transaction", [AdminController::class, 'transaction'])->name("admin.transaction");
    Route::get("/relove-market/admin/product-moderation", [AdminController::class, "productModeration"])->name("admin.product-moderation");
    Route::get("/relove-market/admin/user-management", [AdminController::class, "userManagement"])->name("admin.user-management");
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
