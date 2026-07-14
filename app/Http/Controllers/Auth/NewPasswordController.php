<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Encryption\DecryptException;

use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        try {
            // ✅ 先获取 cookie 值
            $encryptedToken = $request->cookie('reset_token');
            $encryptedEmail = $request->cookie('reset_email');

            // ✅ 检查是否存在
            if (!$encryptedToken || !$encryptedEmail) {
                return Inertia::render('Auth/Login', [
                    'errorMessage' => 'Invalid or expired reset link. Please request a new one.',
                ]);
            }

            // ✅ 尝试解密
            $token = decrypt($encryptedToken);
            $email = decrypt($encryptedEmail);

            // ✅ 验证 token
            $resetRecord = \DB::table('password_reset_tokens')
                ->where('email', $email)
                ->first();

            if (!$resetRecord || !\Hash::check($token, $resetRecord->token)) {
                Cookie::queue(Cookie::forget('reset_token'));
                Cookie::queue(Cookie::forget('reset_email'));

                return Inertia::render('Auth/Login', [
                    'errorMessage' => 'Invalid or expired reset token.',
                ]);
            }

            return Inertia::render('Auth/Login', [
                'email' => $email,
                'token' => $token,
                'showResetModal' => true,
            ]);

        } catch (DecryptException $e) {
            // ✅ 专门捕获解密异常
            \Log::error('Cookie decryption failed', [
                'error' => $e->getMessage(),
                'token_exists' => $request->cookie('reset_token') ? 'yes' : 'no',
                'email_exists' => $request->cookie('reset_email') ? 'yes' : 'no',
            ]);

            // ✅ 清除无效 cookie
            Cookie::queue(Cookie::forget('reset_token'));
            Cookie::queue(Cookie::forget('reset_email'));

            return Inertia::render('Auth/Login', [
                'errorMessage' => 'Invalid reset link. Please request a new one.',
            ]);

        } catch (\Exception $e) {
            // ✅ 其他异常
            \Log::error('Password reset error', [
                'error' => $e->getMessage(),
            ]);

            return Inertia::render('Auth/Login', [
                'errorMessage' => 'Something went wrong. Please try again.',
            ]);
        }
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status == Password::PASSWORD_RESET) {
            try {
                Cookie::queue(Cookie::forget('reset_token'));
                Cookie::queue(Cookie::forget('reset_email'));

                return redirect('/login')->with([
                    'resetSuccess' => true,
                    'cleanUrl' => true,
                    'successMessage' => "Password reset successfully! Please login...",
                ]);
            } catch (ValidationException $e) {
                return redirect('/login')->with([
                    'resetSuccess' => false,
                    'cleanUrl' => false,
                    'errorMessage' => $e->getMessage(),
                ]);
            }
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
