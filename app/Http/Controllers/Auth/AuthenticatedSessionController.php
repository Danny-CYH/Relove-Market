<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
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
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // ✅ Block users if status is not active
        if ($user->status !== 'Active') {
            Auth::logout();
            return back()->with('errorMessage', 'Your account has been blocked. Please contact support.');
        }

        // ✅ If email not verified
        if (!$user->hasVerifiedEmail()) {
            if ($user->last_login_at) {
                Auth::logout();
                return back()->with("errorMessage", "You must verify your email address before logging in.");
            }
        }

        // 📝 Update last login timestamp
        $user->update(['last_login_at' => now()]);

        // Load the role table
        $user->load('role');
        $role_name = $user->role->role_name;

        // Set session data
        session(['user_id' => $user->user_id]);
        if ($role_name === 'Seller') {
            session(['seller_id' => $user->seller_id]);
        }

        // Use Inertia::location for redirects to avoid CSRF issues
        if ($role_name === 'Seller') {
            return Inertia::location(route('seller-dashboard'));
        } elseif ($role_name === 'Buyer') {
            return Inertia::location(route('homepage'));
        } elseif ($role_name === 'Admin') {
            return Inertia::location(route('admin-dashboard'));
        }

        return Inertia::location(route('homepage'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();

        return redirect(route("homepage"));
    }
}
