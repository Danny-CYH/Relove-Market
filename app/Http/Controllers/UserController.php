<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function homepage()
    {
        return Inertia::render('BuyersPage/HomePage', [
            'title' => 'Homepage',
            'description' => 'Welcome to the homepage of our application.',
        ]);
    }

    public function aboutus()
    {
        return Inertia::render('BuyersPage/AboutUs');
    }

    public function shopping()
    {
        return Inertia::render("BuyersPage/ShopPage");
    }
}
