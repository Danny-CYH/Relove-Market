<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $status = Password::sendResetLink(
            $request->only("email")
        );

        if ($status === Password::RESET_LINK_SENT) {
            // ✅ 生成 token
            $token = Str::random(60);

            // 保存到数据库
            \DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'email' => $request->email,
                    'token' => bcrypt($token),
                    'created_at' => now(),
                ]
            );

            // ✅ 设置 cookie（加密存储）
            Cookie::queue('reset_token', encrypt($token), 60); // 60分钟过期

            // ✅ 修复：使用 $request->email 而不是 $email，并移除多余空格
            Cookie::queue('reset_email', encrypt($request->email), 60);

            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent! Please check your email.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => trans($status),
        ], 400);
    }
}