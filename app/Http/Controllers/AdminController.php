<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\SellerRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function adminDashboard()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->get();

        return Inertia::render("AdminPage/AdminDashboard", ['list_sellerRegistration' => $list_sellerRegistration]);
    }

    public function pendingSellerTable()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->get();

        return Inertia::render("AdminPage/PendingSellerTable", ['list_sellerRegistration' => $list_sellerRegistration]);
    }

    public function profilePage()
    {
        return Inertia::render("AdminPage/ProfilePage");
    }
}
