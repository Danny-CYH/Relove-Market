<?php

namespace App\Providers;

use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use Illuminate\Auth\Notifications\ResetPassword;

use Illuminate\Http\Resources\Json\JsonResource;

use App\Mail\ResetPasswordMail;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if (env('APP_ENV') === 'local') {
            curl_setopt_array(curl_init(), [
                CURLOPT_CAINFO => base_path('cacert.pem'),
            ]);
        }

        // Disable wrapping for all JSON resources
        JsonResource::withoutWrapping();

        ResetPassword::toMailUsing(function ($notifiable, $token) {
            return (new ResetPasswordMail($notifiable, $token))
                ->to($notifiable->email);
        });

        Inertia::share([
            'auth' => fn() => [
                'user' => Auth::user(),
            ],
        ]);
    }
}
