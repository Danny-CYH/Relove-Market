<?php

namespace App\Http\Controllers\SellerPage;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('SellerPage/SellerDashboard');
    }

    public function manageProducts()
    {
        return Inertia::render('SellerPage/SellerManageProduct');
    }

    public function manageOrders()
    {
        return Inertia::render('SellerPage/SellerOrderPage');
    }

    public function manageEarnings()
    {
        return Inertia::render('SellerPage/SellerEarningPage');
    }

    public function helpSupport()
    {
        return Inertia::render('SellerPage/SellerHelpSupportPage');
    }

    public function profile()
    {
        return Inertia::render('SellerPage/SellerUpdateProfile');
    }
}
