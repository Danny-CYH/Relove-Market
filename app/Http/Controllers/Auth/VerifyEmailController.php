<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request, $id, $hash): RedirectResponse
    {
        \Log::info('=== VERIFICATION START ===', [
            'id' => $id,
            'hash' => $hash,
            'full_url' => $request->fullUrl(),
        ]);

        \Log::info('=== VERIFICATION CONTROLLER HIT! ===');
        \Log::info('Basic info', ['id' => $id, 'hash' => $hash]);

        $user = User::find($id);

        if (!$user) {
            \Log::error('User not found', ['id' => $id]);
            abort(404, 'User not found.');
        }

        \Log::info('User found', [
            'user_id' => $user->user_id,
            'email' => $user->email,
            'current_email_verified_at' => $user->email_verified_at,
            'hasVerifiedEmail' => $user->hasVerifiedEmail(),
        ]);

        // Verify hash matches
        $expectedHash = sha1($user->getEmailForVerification());
        \Log::info('Hash comparison', [
            'expected' => $expectedHash,
            'received' => $hash,
            'email_for_hash' => $user->getEmailForVerification(),
            'match' => hash_equals((string) $hash, $expectedHash),
        ]);

        if (!hash_equals((string) $hash, $expectedHash)) {
            \Log::error('Hash mismatch!');
            abort(403, 'Invalid verification link.');
        }

        if ($user->hasVerifiedEmail()) {
            \Log::info('Email already verified');
            Auth::login($user);
            return redirect()->route('homepage')
                ->with('successMessage', 'Email already verified!');
        }

        // Try to mark as verified
        $result = $user->markEmailAsVerified();

        \Log::info('markEmailAsVerified result', [
            'success' => $result,
            'user_saved' => $user->wasChanged(),
            'new_email_verified_at' => $user->email_verified_at,
        ]);

        if ($result) {
            event(new Verified($user));
            \Log::info('Verified event fired');
        } else {
            \Log::error('Failed to mark email as verified!');
        }

        Auth::login($user);

        \Log::info('=== VERIFICATION END ===', [
            'user_logged_in' => Auth::check(),
            'final_email_verified_at' => $user->email_verified_at,
        ]);

        return redirect()->route('homepage');
    }
}