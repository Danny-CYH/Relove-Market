<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\AdminController;

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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Users actions
Route::post('/resend-verification', [RegisteredUserController::class, 'resendVerification'])
    ->name('custom.verification.send');

// Buyers actions
Route::get('/relove-market', [UserController::class, 'homepage'])->name('homepage');
Route::get("/about-us", [UserController::class, 'aboutus'])->name("about-us");
Route::get("/shopping", [UserController::class, 'shopping'])->name("shopping");
Route::get('/become-seller', [UserController::class, 'becomeSeller'])->name('become-seller');
Route::get("/item-details", [UserController::class, "itemDetails"])->name('item-details');
Route::get('/wishlist', [UserController::class, 'wishlist'])->name('wishlist');
Route::get("/seller-registration", [UserController::class, "sellerRegistration"])->name('seller-registration');
Route::get('/seller-shop', [UserController::class, 'sellerShop'])->name('seller-shop');
Route::get('/checkout', [UserController::class, 'checkout'])->name('checkout');

Route::post('/seller-registration-process', [UserController::class, 'sellerRegistrationProcess'])->name("seller-registration-process");
Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);

// Sellers actions
Route::get('/seller-dashboard', [SellerController::class, 'sellerDashboard'])->name('seller-dashboard');
Route::get('/seller-subscriptions', [SellerController::class, 'sellerSubscription'])->name("seller-subscriptions");

// Admin section
Route::get('/admin-dashboard', [AdminController::class, 'adminDashboard'])->name('admin-dashboard');
Route::get("/pending-seller-list", [AdminController::class, "pendingSellerTable"])->name("pending-seller-list");
Route::get("/admin-profile", [AdminController::class, 'profilePage'])->name("admin-profile");
Route::get("/list-transaction", [AdminController::class, 'transactionPage'])->name("list-transaction");
Route::get("/subscription-management", [AdminController::class, 'subscriptionManagement'])->name("subscription-management");
Route::get("/subscription-policy", [AdminController::class, 'subscriptionPolicy'])->name("subscription-policy");

Route::get('/admin/dashboard/list', [AdminController::class, 'getSellerList']);
Route::post('/admin/pending-seller/{id}/action', [AdminController::class, 'handleAction']);

require __DIR__ . '/auth.php';
