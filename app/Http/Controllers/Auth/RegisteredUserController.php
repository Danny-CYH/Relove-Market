<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;

use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $latestUser = User::orderBy('user_id', 'desc')->first();

            $number = ($latestUser && preg_match('/USR-(\d+)/', $latestUser->user_id, $matches))
                ? (int) $matches[1] + 1
                : 1;

            $newUserId = 'USR-' . str_pad($number, 5, '0', STR_PAD_LEFT);

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'user_id' => $newUserId,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => Role::where('role_name', 'Buyer')->value('role_id'),
                'status' => "Active"
            ]);

            event(new Registered($user));

            return redirect(route("register"))->with('showVerificationModal', true);
        } catch (ValidationException $e) {
            return back()->with("errorMessage", $e->getMessage());
        } catch (\Throwable $e) {
            return back()->with('errorMessage', $e->getMessage());
        }
    }

    public function resendVerification(Request $request)
    {
        try {
            $request->validate([
                'user_email' => 'required|email|exists:users,email',
            ]);

            $user = User::where('email', $request->user_email)->first();

            if ($user && !$user->hasVerifiedEmail()) {
                event(new Registered($user));
            }

            // Check if it's an Inertia request
            if ($request->header('X-Inertia')) {
                return back()->with('successMessage', 'Verification email resent.');
            }

            return back()->with('successMessage', 'Verification email resent.');
        } catch (Exception $e) {
            return back()->with('errorMessage', $e->getMessage());
        }
    }
}
