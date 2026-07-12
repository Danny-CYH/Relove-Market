<?php

use App\Http\Controllers\AdminPage\AdminDashboardController;
use App\Http\Controllers\AdminPage\ProductModerationController;
use App\Http\Controllers\AdminPage\SellerPendingController;
use App\Http\Controllers\AdminPage\TransactionManagementController;
use App\Http\Controllers\AdminPage\UserManagementController;

use App\Http\Controllers\BuyerPage\ProfileManagementController;
use App\Http\Controllers\BuyerPage\WishlistController;
use App\Http\Controllers\BuyerPage\CartController;
use App\Http\Controllers\BuyerPage\SellerRegistrationController;
use App\Http\Controllers\BuyerPage\ProductManagementController;

use App\Http\Controllers\SellerPage\SellerManageProfileController;
use App\Http\Controllers\SellerPage\SellerDashboardController;
use App\Http\Controllers\SellerPage\SellerManageEarningController;
use App\Http\Controllers\SellerPage\SellerManageOrderController;
use App\Http\Controllers\SellerPage\SellerManageProductController;

use Illuminate\Support\Facades\Route;

/**
 * TODO: Need to combine the route seller update info and password into 1 route (PATCH /profile/seller/info & PATCH /profile/seller/password)
 * TODO: Need to applied the version of the API (v1, v2, v3) for the future development.
 */

// Note: The API for buyer used only
Route::middleware(["is_buyer"])->group(function () {
    // * API for manage the profile on the profile page
    Route::get("/profile/orders", [ProfileManagementController::class, "orders"])->name("profile.orders");
    Route::post('/profile/orders/{orderId}/confirm-delivery', [ProfileManagementController::class, 'confirmDelivery'])->name('profile.confirm-delivery');
    Route::patch("/profile/info", [ProfileManagementController::class, "updateProfile"])->name("profile.info");
    Route::patch('/profile/password', [ProfileManagementController::class, 'updatePassword'])->name('profile.password');
    Route::get('/profile/check-address', [ProfileManagementController::class, 'checkAddress'])->name('profile.check-address');

    // * API for manage the wishlist operations on wishlist and product details page
    Route::get("/wishlist/all", [WishlistController::class, "getAllWishlist"])->name("wishlist.all");
    Route::get("/wishlist/{product_id}", [WishlistController::class, "getWishlist"])->name("wishlist.check");
    Route::post('/wishlist', [WishlistController::class, 'storeWishlist'])->name("wishlist.store");
    Route::patch('/wishlist/update-variant', [WishlistController::class, 'updateVariant'])->name("wishlist.update-variant");
    Route::delete('/wishlist', [WishlistController::class, 'removeWishlist'])->name("wishlist.remove");

    //  * API for manage cart operations on cart page
    Route::get("/cart/all", [CartController::class, "getAllCart"])->name("cart.all");
    Route::get("/cart/{product_id}", [CartController::class, "getCart"])->name("cart.check");
    Route::post('/cart', [CartController::class, 'storeCart'])->name("cart.store");
    Route::patch('/cart/update-variant', [CartController::class, 'updateVariant'])->name("cart.update-variant");
    Route::delete('/cart', [CartController::class, 'removeCart'])->name("cart.remove");

    // * API for register an a seller account on seller registration page
    Route::post('/seller-registration', [SellerRegistrationController::class, 'sellerRegistrationProcess'])->name("seller-registration-process");

    // * API for manage the reviews on product details page.
    Route::post("/reviews", [ProductManagementController::class, "storeReview"])->name("review.store");
});

// Note: The API for seller used only
Route::middleware(["is_seller"])->group(function () {
    // * API for the seller dashboard
    Route::get("/dashboard/data", [SellerDashboardController::class, "getDashboardData"])->name("seller.dashboard.data");
    Route::get("/dashboard/featured-products", [SellerDashboardController::class, 'getFeaturedProducts'])->name("seller.dashboard.featured-products");

    // * API for seller manage products
    Route::get("/manage-products/products", [SellerManageProductController::class, "getProducts"])->name("seller.products.index");
    Route::post('/manage-products/products', [SellerManageProductController::class, 'addProducts'])->name('seller.products.store');
    Route::patch('/manage-products/products', [SellerManageProductController::class, 'editProducts'])->name('seller.products.update');
    Route::delete('/manage-products/products', [SellerManageProductController::class, 'deleteProducts'])->name('seller.products.delete');
    Route::patch('/manage-products/products/listing', [SellerManageProductController::class, 'listingProducts'])->name("seller.products.listing");
    Route::patch('/manage-products/products/featured', [SellerManageProductController::class, 'featuredProducts'])->name("seller.products.featured");
    Route::get('/manage-products/products/metrics', [SellerManageProductController::class, 'metricsProducts'])->name("seller.products.metrics");
    Route::patch('/manage-products/products/status', [SellerManageProductController::class, 'statusProducts'])->name("seller.products.status");

    // * API for seller manage orders
    Route::get("/manage-orders/list-order", [SellerManageOrderController::class, "listOrder"])->name("seller.orders.index");
    Route::put("/manage-orders/update-order/{orderId}/status", [SellerManageOrderController::class, "updateOrderStatus"])->name("seller.orders.update");

    // * API for seller manage earnings
    Route::get('/manage-earnings/seller-earnings', [SellerManageEarningController::class, 'getEarnings'])->name("seller.earnings.index");
    Route::post('/manage-earnings/seller-earnings/income-report', [SellerManageEarningController::class, 'incomeReport'])->name("seller.earnings.income-report");

    // * API for manage the profile on the seller manage profile page
    Route::get('/profile/seller', [SellerManageProfileController::class, 'getProfile'])->name("seller.profile.index");
    Route::patch('/profile/seller/info', [SellerManageProfileController::class, 'updateProfileSeller'])->name("seller.profile.info.update");
    Route::patch('/profile/seller/password', [SellerManageProfileController::class, 'updateProfilePassword'])->name("seller.profile.password.update");
    Route::delete('/profile/seller/image', [SellerManageProfileController::class, 'deleteProfileImage'])->name("seller.profile.image.delete");

    // * API for manage the store information on the seller manage profile page
    Route::patch('/profile/store', [SellerManageProfileController::class, 'updateProfileStore'])->name("seller.profile.store.update");
    Route::delete('/profile/store/image', [SellerManageProfileController::class, 'deleteStoreImage'])->name("seller.profile.store.delete");
});

// Note: The API for admin used only
Route::middleware(["is_admin"])->group(function () {
    // * API for admin dashboard
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats'])->name('admin.dashboard.stats');
    Route::get('/dashboard/notifications', [AdminDashboardController::class, 'getNotifications'])->name('admin.dashboard.notifications');

    // * API for manage pending seller
    Route::get('/seller-list', [SellerPendingController::class, 'getSellerList'])->name("admin.seller-list");
    Route::post('/pending-seller/{id}/action', [SellerPendingController::class, 'handleAction'])->name("admin.handle-action");

    // * API for manage products
    Route::get('/manage-products', [ProductModerationController::class, 'getProducts'])->name('admin.products.index');
    Route::get('/manage-products/stats', [ProductModerationController::class, 'statsProducts'])->name('admin.products.stats');
    Route::post('/manage-products/{product}/block', [ProductModerationController::class, 'blockProducts'])->name("admin.products.block");
    Route::post('/manage-products/{product}/unblock', [ProductModerationController::class, 'unblockProducts'])->name("admin.products.unblock");
    Route::post('/manage-products/{product}/flag', [ProductModerationController::class, 'flagProducts'])->name("admin.products.flag");
    Route::get('/manage-products/{product}/analysis', [ProductModerationController::class, 'analysisProducts'])->name('admin.products.analysis');

    Route::get("/manage-transactions", [TransactionManagementController::class, 'filterFunction'])->name("filter-functions");
    Route::get("/manage-transactions/metrics", [TransactionManagementController::class, "getData"])->name("get-data");
    Route::post('/manage-transactions/{orderId}/release-payment', [TransactionManagementController::class, 'releasePayment'])->name('release-payment');
    Route::get('/manage-transactions/{orderId}/tracking', [TransactionManagementController::class, 'getOrderTracking']);
    Route::post('/manage-transactions/{orderId}/manual-release', [TransactionManagementController::class, 'manualReleasePayment']);

    // API for manage users.
    Route::get("/user-management/list", [UserManagementController::class, "getUserList"])->name("list-user");
    Route::get('/user-management/details/{id}', [UserManagementController::class, 'getUserDetails']);
    Route::post('/user-management/actions', [UserManagementController::class, 'handleUserActions'])->name('user-management.actions');
    Route::get('/user-management/stats', [UserManagementController::class, 'getUserStats'])->name('user-management.stats');
});
