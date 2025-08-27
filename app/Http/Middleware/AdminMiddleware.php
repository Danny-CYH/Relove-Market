<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            // If not logged in, redirect to login
            return redirect()->route('login');
        }

        $user = Auth::user();
        $user_role = $user->load("role");

        // Check if the user's role matches
        if ($user_role->role->role_name !== "Admin") {
            // If not authorized, redirect or abort
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
