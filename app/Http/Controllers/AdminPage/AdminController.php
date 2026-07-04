<?php

namespace App\Http\Controllers\AdminPage;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('AdminPage/AdminDashboard');
    }

    public function pendingSeller()
    {
        return Inertia::render('AdminPage/PendingSellerTable');
    }

    public function profile()
    {
        return Inertia::render('AdminPage/ProfilePage');
    }

    public function transaction()
    {
        return Inertia::render('AdminPage/Transactions');
    }

    public function productModeration()
    {
        return Inertia::render('AdminPage/ProductModeration');
    }

    public function userManagement()
    {
        return Inertia::render('AdminPage/UserManagement');
    }
}
