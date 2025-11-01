<?php

use App\Http\Controllers\AdminPage\AdminDashboardController;
use App\Http\Controllers\AdminPage\UserManagementController;

use App\Http\Controllers\BuyerPage\HomePageController;
use App\Http\Controllers\BuyerPage\ProfileManagementController;
use App\Http\Controllers\BuyerPage\WishlistController;
use App\Http\Controllers\BuyerPage\SellerRegistrationController;
use App\Http\Controllers\BuyerPage\ProductManagementController;

use App\Http\Controllers\SellerPage\SellerDashboardController;
use App\Http\Controllers\SellerPage\SellerManageEarningController;
use App\Http\Controllers\SellerPage\SellerManageOrderController;
use App\Http\Controllers\SellerPage\SellerManageProductController;
use App\Http\Controllers\SellerPage\SubscriptionPaymentController;

Route::middleware(["is_buyer"])->group(function () {
    // Code for calling the featured and flash sale products on the home page
    Route::get("/api/get-featured-products", [HomePageController::class, "get_featuredProducts"])->name("get-featured-products");
    Route::get("/api/get-flash-sale-products", [HomePageController::class, "get_flashSaleProducts"])->name("get-flash-sale-products");

    // COde for manage the profile on the profile page
    Route::get("/api/orders-history", [ProfileManagementController::class, "orderHistory"])->name("order-history");
    Route::post("/api/profile-update", [ProfileManagementController::class, "updateProfile"])->name("update-profile");

    // Code for manage the wishlist operations on wishlist and product details page
    Route::get("/api/get-all-wishlist", [WishlistController::class, "get_allWishlist"])->name("all-wishlist");
    Route::get("/api/get-wishlist/{product_id}", [WishlistController::class, "get_wishlist"])->name("get-wishlist");
    Route::post('/api/store-wishlist', [WishlistController::class, 'store_wishlist'])->name("store-wishlist");
    Route::post('/api/update-wishlist-variant', [WishlistController::class, 'updateVariant'])->name("update-wishlist-variant");
    Route::delete('/api/remove-wishlist', [WishlistController::class, 'remove_wishlist'])->name("remove-wishlist");

    // Code for register an a seller account on seller registration page
    Route::post('/api/seller-registration-process', [SellerRegistrationController::class, 'sellerRegistrationProcess'])->name("seller-registration-process");

    // Code for manage the reviews on product details page.
    Route::post("/api/make-reviews", [ProductManagementController::class, "make_review"])->name("make-review");
});

// API functions for seller page
Route::middleware(["is_seller"])->group(function () {
    // API for the seller dashboard
    Route::get("/api/seller-subscriptions", [SellerDashboardController::class, "getSubscriptionStatus"])->name("seller-subscriptions");
    Route::post("/api/start-trial", [SellerDashboardController::class, "startTrial"])->name("start-trial");
    Route::get("/api/dashboard-data", [SellerDashboardController::class, "getData_dashboard"])->name("dashboard-data");
    Route::get("/api/featured-products", [SellerDashboardController::class, 'get_FeaturedProducts'])->name("featured-products");

    // API for seller manage products
    Route::get("/api/seller-manage-product/get-product", [SellerManageProductController::class, "get_ListProduct"])->name("product-data");
    Route::post('/api/seller-manage-product/add-product', [SellerManageProductController::class, 'sellerAddProduct'])->name('add-product');
    Route::post('/api/seller-manage-product/edit-product', [SellerManageProductController::class, 'sellerEditProduct'])->name('edit-product');
    Route::post('/api/seller-manage-product/delete-product', [SellerManageProductController::class, 'sellerDeleteProduct'])->name('delete-product');
    Route::post('/api/seller/toggle-listing', [SellerManageProductController::class, 'toggleProductListing'])->name("product-listing");
    Route::post('/api/seller/toggle-product-featured', [SellerManageProductController::class, 'toggleProductFeatured'])->name("product-featured");

    // API for seller manage order
    Route::get("/api/get-list-order", [SellerManageOrderController::class, "get_listOrder"])->name("list-order");
    Route::put("/api/update-order/{orderId}/status", [SellerManageOrderController::class, "updateStatus"])->name("update-order");

    // API for seller manage earnings
    Route::get('/api/seller-earnings', [SellerManageEarningController::class, 'getEarnings'])->name("earnings");
    Route::post('/api/generate-income-report', [SellerManageEarningController::class, 'generateIncomeReport'])->name("generate-report");

    // API for seller manage subscriptions.
    Route::post('/api/subscriptions/create-payment-intent', [SubscriptionPaymentController::class, 'createSubscriptionPaymentIntent']);
    Route::post('/api/subscriptions/confirm-payment', [SubscriptionPaymentController::class, 'confirmSubscriptionPayment']);
});

// API function for admin page
Route::middleware(["is_admin"])->group(function () {
    // API for admin dashboard
    Route::get('/api/admin/dashboard/stats', [AdminDashboardController::class, 'getStats'])->name('admin.dashboard.stats');
    Route::get('/api/admin/dashboard/notifications', [AdminDashboardController::class, 'getNotifications']);

    // API for manage products
    Route::get('/api/admin/products', [ProductManagementController::class, 'get_allProducts'])->name('get-all-products');
    Route::get('/api/admin/products/stats', [ProductManagementController::class, 'get_product_stats'])->name('get-product-stats');
    Route::post('/api/admin/products/{product}/{action}', [ProductManagementController::class, 'update_product_status'])->name('update-product-status');

    Route::post('/products/{product}/block', [ProductManagementController::class, 'block_product']);
    Route::post('/products/{product}/unblock', [ProductManagementController::class, 'unblock_product']);
    Route::post('/products/{product}/flag', [ProductManagementController::class, 'flag_product']);

    // API for manage users.
    Route::get("/api/admin/user-management/list", [UserManagementController::class, "getUserList"])->name("list-user");
    Route::post('/api/admin/user-management/actions', [UserManagementController::class, 'handleUserActions'])->name('user-management.actions');
    Route::get('/api/admin/user-management/stats', [UserManagementController::class, 'getUserStats'])->name('user-management.stats');
});
