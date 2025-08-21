<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        //load the role table
        $user->load('role');

        $role_name = $user->role->role_name;

        // Redirect based on role
        if ($role_name === 'Seller') {
            $user = User::where('email', $request->email)->first();
            $seller_id = $user->seller_id;

            // Store seller_id in session (so you can use it later)
            session(['seller_id' => $seller_id]);

            return redirect()->intended(route('seller-dashboard'));
        } elseif ($role_name === 'Buyer') {
            return redirect()->intended(route('homepage'));
        } elseif ($role_name === 'Admin') {
            return redirect()->intended(route('admin-dashboard'));
        }

        // Default fallback
        return redirect()->intended(route('homepage'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/relove-market');
    }
}
