<?php

namespace App\Traits;

trait UserTrait
{
    /**
     * Get current user's custom user_id
     * 
     * @return string|null
     */
    protected function userId()
    {
        return auth()->user()->user_id ?? null;
    }

    /**
     * Get current authenticated user
     * 
     * @return \App\Models\User|null
     */
    protected function currentUser()
    {
        return auth()->user();
    }

    /**
     * Check if user is authenticated
     * 
     * @return bool
     */
    protected function isAuthenticated()
    {
        return auth()->check();
    }
}