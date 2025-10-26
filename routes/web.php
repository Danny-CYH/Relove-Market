<?php

use App\Http\Controllers\BuyerPage\ManageActionController;
use App\Http\Controllers\BuyerPage\UserController;

use App\Http\Controllers\ProfileController;

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SellerPage\SubscriptionPaymentController;
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

// Code for calling the product image based recommendation for user
Route::post("/recommend", [ManageActionController::class, "getRecommendations"])->name("recommend");

// Code for calling the featured and flash sale products on the home page
Route::get("/api/buyer/get-featured-products", [ManageActionController::class, "get_featuredProducts"]);
Route::get("/api/buyer/get-flash-sale-products", [ManageActionController::class, "get_flashSaleProducts"]);

Route::get("/api/get-list-products", [ManageActionController::class, "get_listProducts"]);

// General Page that can be access without login
Route::get('/relove-market', [UserController::class, 'homepage'])->name('homepage');
Route::get("/about-us", [UserController::class, 'aboutus'])->name("about-us");
Route::get("/shopping", [UserController::class, 'shopping'])->name("shopping");
Route::get("/seller-benefit", [UserController::class, 'sellerBenefit'])->name("seller-benefit");
Route::get("/product-details/{productId}", [UserController::class, "productDetails"])->name('product-details');

Route::get("/seller-registration", [UserController::class, "sellerRegistration"])->name('seller-registration');
Route::get('/seller-shop', [UserController::class, 'sellerShop'])->name('seller-shop');

// Need to login account and is a buyer can access this all feature
Route::middleware(["is_buyer"])->group(function () {
    // Code for returning the page
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

    // Code for register an a seller account
    Route::post('/seller-registration-process', [ManageActionController::class, 'sellerRegistrationProcess'])->name("seller-registration-process");

    // Code for manage the wishlist and reviews operations
    Route::get("/api/get-all-wishlist", [ManageActionController::class, "get_allWishlist"]);
    Route::get("/api/get-wishlist/{product_id}", [ManageActionController::class, "get_wishlist"]);
    Route::post('/api/store-wishlist', [ManageActionController::class, 'store_wishlist']);
    Route::delete('/api/remove-wishlist', [ManageActionController::class, 'remove_wishlist']);
    Route::post("/api/make-reviews", [ManageActionController::class, "make_review"]);

    Route::get("/api/orders-history", [ManageActionController::class, "orderHistory"]);

    Route::post("/api/profile-update", [ManageActionController::class, "updateProfile"]);
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
    Route::get('/seller-manage-profile', [SellerController::class, 'getProfile'])->name("seller-manage-profile");

    Route::post('/profile-update', [SellerController::class, 'updateProfile']);

    Route::get('/seller-chat', [ChatController::class, "sellerChat"])->name('seller-chat');

    Route::get("/seller-purchase-subscription/{subscription_plan_id}", [SellerController::class, "sellerPurchaseSubscription"])->name("seller-purchase-subscription");

    Route::get("/api/getData-dashboard", [SellerController::class, "getData_dashboard"]);
    Route::post("/api/start-trial", [SellerController::class, "startTrial"]);
    Route::get("/api/seller-subscriptions", [SellerController::class, "getSubscriptionStatus"]);
    Route::get("/api/seller-order-latest", [SellerController::class, "getLatestOrders"]);

    // Code for seller manage product page API
    Route::get("/api/seller-manage-product/get-product", [SellerController::class, "get_ListProduct"]);
    Route::post('/seller-manage-product/add-product', [SellerController::class, 'sellerAddProduct'])->name('add-product');
    Route::post('/seller-manage-product/edit-product', [SellerController::class, 'sellerEditProduct'])->name('edit-product');
    Route::post('/seller-manage-product/delete-product', [SellerController::class, 'sellerDeleteProduct'])->name('delete-product');
    Route::get("/api/seller/featured-products", [SellerController::class, 'get_FeaturedProducts']);
    Route::post('/api/seller/toggle-listing', [SellerController::class, 'toggleProductListing']);
    Route::post('/api/seller/toggle-product-featured', [SellerController::class, 'toggleProductFeatured']);

    // Code for getting and manage the order data from buyer 
    Route::get("/api/get-list-order", [SellerController::class, "get_listOrder"]);
    Route::put("/api/update-order/{orderId}/status", [SellerController::class, "updateStatus"]);

    Route::get('/api/seller-earnings', [SellerController::class, 'getEarnings']);

    Route::post('/api/generate-income-report', [SellerController::class, 'generateIncomeReport']);

    // Subscription Payment Routes
    Route::post('/api/subscriptions/create-payment-intent', [SubscriptionPaymentController::class, 'createSubscriptionPaymentIntent']);
    Route::post('/api/subscriptions/confirm-payment', [SubscriptionPaymentController::class, 'confirmSubscriptionPayment']);

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

// code for calling and setting the chat communication between buyer and seller
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::get('/messages/{conversationId}', [ChatController::class, 'getMessages']);
    Route::post('/send-message', [ChatController::class, 'sendMessage']);
    Route::post('/conversations/{conversationId}/mark-read', [ChatController::class, 'markAsRead']);
    Route::post('/start-conversation', [ChatController::class, 'startConversation']);
});

require __DIR__ . '/auth.php';
