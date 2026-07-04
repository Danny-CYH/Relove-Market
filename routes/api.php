<?php

use App\Http\Controllers\AdminPage\AdminDashboardController;
use App\Http\Controllers\AdminPage\ProductModerationController;
use App\Http\Controllers\AdminPage\SellerPendingController;
use App\Http\Controllers\AdminPage\TransactionManagementController;
use App\Http\Controllers\AdminPage\UserManagementController;

use App\Http\Controllers\BuyerPage\ProfileManagementController;
use App\Http\Controllers\BuyerPage\WishlistController;
use App\Http\Controllers\BuyerPage\SellerRegistrationController;
use App\Http\Controllers\BuyerPage\ProductManagementController;

use App\Http\Controllers\SellerPage\SellerManageProfileController;
use App\Http\Controllers\SellerPage\SellerDashboardController;
use App\Http\Controllers\SellerPage\SellerManageEarningController;
use App\Http\Controllers\SellerPage\SellerManageOrderController;
use App\Http\Controllers\SellerPage\SellerManageProductController;

use Illuminate\Support\Facades\Route;

Route::middleware(["is_buyer"])->group(function () {
    // Route for manage the profile on the profile page
    Route::get("/profile/orders", [ProfileManagementController::class, "orders"])->name("profile.orders");
    Route::patch("/profile/info", [ProfileManagementController::class, "updateProfile"])->name("profile.info");
    Route::patch('/profile/password', [ProfileManagementController::class, 'updatePassword'])->name('profile.password');
    Route::get('/profile/check-address', [ProfileManagementController::class, 'checkAddress'])->name('profile.check-address');
    Route::post('/orders/{orderId}/confirm-delivery', [ProfileManagementController::class, 'confirmDelivery'])->name('confirm-delivery');

    // Route for manage the wishlist operations on wishlist and product details page
    Route::get("/wishlist/all", [WishlistController::class, "getAllWishlist"])->name("wishlist.all");
    Route::get("/wishlist/{product_id}", [WishlistController::class, "getWishlist"])->name("wishlist.check");
    Route::post('/wishlist', [WishlistController::class, 'storeWishlist'])->name("wishlist.store");
    Route::patch('/wishlist/update-variant', [WishlistController::class, 'updateVariant'])->name("wishlist.update-variant");
    Route::delete('/wishlist', [WishlistController::class, 'removeWishlist'])->name("wishlist.remove");

    // Code for register an a seller account on seller registration page
    Route::post('/seller-registration', [SellerRegistrationController::class, 'sellerRegistrationProcess'])->name("seller-registration-process");

    // Code for manage the reviews on product details page.
    Route::post("/reviews", [ProductManagementController::class, "make_review"])->name("make-review");
});

// API functions for seller page
Route::middleware(["is_seller"])->group(function () {
    // API for the seller dashboard
    Route::get("/api/dashboard-data", [SellerDashboardController::class, "getData_dashboard"])->name("dashboard-data");
    Route::get("/api/featured-products", [SellerDashboardController::class, 'get_FeaturedProducts'])->name("featured-products");

    // API for seller manage products
    Route::get("/api/seller-manage-product/get-product", [SellerManageProductController::class, "get_ListProduct"])->name("product-data");
    Route::post('/api/seller-manage-product/add-product', [SellerManageProductController::class, 'sellerAddProduct'])->name('add-product');
    Route::post('/api/seller-manage-product/edit-product', [SellerManageProductController::class, 'sellerEditProduct'])->name('edit-product');
    Route::post('/api/seller-manage-product/delete-product', [SellerManageProductController::class, 'sellerDeleteProduct'])->name('delete-product');
    Route::post('/api/seller/toggle-listing', [SellerManageProductController::class, 'toggleProductListing'])->name("product-listing");
    Route::post('/api/seller/toggle-product-featured', [SellerManageProductController::class, 'toggleProductFeatured'])->name("product-featured");
    Route::get('/api/products/metrics', [SellerManageProductController::class, 'getProductMetrics']);
    Route::post('/api/products/auto-update-status', [SellerManageProductController::class, 'autoUpdateProductStatus']);

    // API for seller manage order
    Route::get("/api/get-list-order", [SellerManageOrderController::class, "get_listOrder"])->name("list-order");
    Route::put("/api/update-order/{orderId}/status", [SellerManageOrderController::class, "updateStatus"])->name("update-order");

    // API for seller manage earnings
    Route::get('/api/seller-earnings', [SellerManageEarningController::class, 'getEarnings'])->name("earnings");
    Route::post('/api/generate-income-report', [SellerManageEarningController::class, 'generateIncomeReport'])->name("generate-report");

    Route::get('/profile/seller', [SellerManageProfileController::class, 'getProfile']);
    Route::post('/profile/store', [SellerManageProfileController::class, 'updateStoreProfile']);
    Route::patch('/profile/update', [SellerManageProfileController::class, 'updateUserProfile']);
    Route::patch('/profile/update/password', [SellerManageProfileController::class, 'updatePassword']);
    Route::delete('/profile/image', [SellerManageProfileController::class, 'deleteProfileImage']);
    Route::delete('/profile/image', [SellerManageProfileController::class, 'deleteStoreImage']);
});

// API function for admin page
Route::middleware(["is_admin"])->group(function () {
    // API for admin dashboard
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats'])->name('admin.dashboard.stats');
    Route::get('/dashboard/notifications', [AdminDashboardController::class, 'getNotifications']);

    Route::get('/dashboard/seller-list', [SellerPendingController::class, 'getSellerList'])->name("seller-list");
    Route::post('/api/admin/pending-seller/{id}/action', [SellerPendingController::class, 'handleAction'])->name("handle-action");

    // API for manage products
    Route::get('/products', [ProductModerationController::class, 'get_allProducts'])->name('get-all-products');
    Route::get('/products/stats', [ProductModerationController::class, 'get_product_stats'])->name('get-product-stats');
    Route::post('/products/{product}/block', [ProductModerationController::class, 'block_product'])->name("admin.products.block");
    Route::post('/products/{product}/unblock', [ProductModerationController::class, 'unblock_product'])->name("admin.products.unblock");
    Route::post('/products/{product}/flag', [ProductModerationController::class, 'flag_product'])->name("admin.products.flag");
    Route::get('/products/{product}/analysis', [ProductModerationController::class, 'getProductAnalysis'])->name('admin.product-analysis');

    Route::get("/transactions", [TransactionManagementController::class, 'filterFunction'])->name("filter-functions");
    Route::get("/transactions/metrics", [TransactionManagementController::class, "getData"])->name("get-data");
    Route::post('/transactions/{orderId}/release-payment', [TransactionManagementController::class, 'releasePayment'])->name('release-payment');
    Route::get('/transactions/{orderId}/tracking', [TransactionManagementController::class, 'getOrderTracking']);
    Route::post('/{orderId}/manual-release', [TransactionManagementController::class, 'manualReleasePayment']);

    // API for manage users.
    Route::get("/user-management/list", [UserManagementController::class, "getUserList"])->name("list-user");
    Route::get('/user-management/details/{id}', [UserManagementController::class, 'getUserDetails']);
    Route::post('/user-management/actions', [UserManagementController::class, 'handleUserActions'])->name('user-management.actions');
    Route::get('/user-management/stats', [UserManagementController::class, 'getUserStats'])->name('user-management.stats');
});
