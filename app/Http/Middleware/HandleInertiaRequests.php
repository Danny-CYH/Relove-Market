<?php

namespace App\Http\Middleware;

use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => function () use ($request) {
                    $user = $request->user();
                    $seller = $request->user('seller');

                    if ($user) {
                        $user->load('role');

                        return [
                            'user_id' => $user->user_id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'role_id' => $user->role_id,
                            'role_name' => $user->role->role_name,
                            'seller_id' => $user->seller_id,
                        ];
                    }
                    if ($seller) {
                        return [
                            'type' => 'seller',
                            'seller_id' => $seller->seller_id,
                            'name' => $seller->seller_name,
                            'email' => $seller->seller_email,
                        ];
                    }

                    return null;
                },


            ],

            'flash' => [
                'successMessage' => fn() => $request->session()->get('successMessage'),
                'errorMessage' => fn() => $request->session()->get('errorMessage'),
            ],
        ]);
    }
}
