<?php

namespace App\Http\Controllers\SellerPage;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function sellerDashboard()
    {
        return Inertia::render('SellerPage/SellerDashboard');
    }

    public function sellerManageProduct()
    {
        return Inertia::render('SellerPage/SellerManageProduct');
    }

    public function sellerOrderPage()
    {
        return Inertia::render('SellerPage/SellerOrderPage');
    }

    public function sellerEarningPage()
    {
        return Inertia::render('SellerPage/SellerEarningPage');
    }

    public function sellerHelpSupportPage()
    {
        return Inertia::render('SellerPage/SellerHelpSupportPage');
    }

    public function getProfile()
    {
        return Inertia::render('SellerPage/SellerUpdateProfile');
    }
}
