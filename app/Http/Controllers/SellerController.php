<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SellerShop;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function sellerDashboard()
    {
        return Inertia::render('SellersPage/SellerDashboard');
    }

    public function sellerSubscription()
    {
        return Inertia::render("SellersPage/SellerSubscriptionPage");
    }
}
