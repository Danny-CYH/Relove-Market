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
        \Log::info('LOGIN ATTEMPT START - Current auth status', [
            'already_logged_in' => Auth::check(),
            'auth_user_id' => Auth::id(),
            'session_id' => session()->getId(),
        ]);

        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        \Log::info('LOGIN ATTEMPT - User authenticated', [
            'user_id' => $user->user_id,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'hasVerifiedEmail' => $user->hasVerifiedEmail(),
            'status' => $user->status,
            'last_login_at' => $user->last_login_at,
        ]);

        // ✅ Block users if status is not active
        if ($user->status !== 'Active') {
            Auth::logout();
            return back()->with('errorMessage', 'Your account has been blocked. Please contact support.');
        }

        // ✅ BLOCK ALL LOGINS if email is not verified (remove the last_login_at check)
        if (!$user->hasVerifiedEmail()) {
            Auth::logout();
            return back()->with("errorMessage", "You must verify your email address before logging in.");
        }

        // 📝 Update last login timestamp
        $user->update(['last_login_at' => now()]);

        // Load the role table
        $user->load('role');
        $role_name = $user->role->role_name;

        // Use Inertia::location for redirects to avoid CSRF issues
        if ($role_name === 'Seller') {
            session(['seller_id' => $user->seller_id]);
            return redirect()->route('seller-dashboard');
        } elseif ($role_name === 'Buyer') {
            session(['user_id' => $user->user_id]);
            return redirect()->route('homepage');
        } elseif ($role_name === 'Admin') {
            session(['user_id' => $user->user_id]);
            return redirect()->route('admin-dashboard');
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