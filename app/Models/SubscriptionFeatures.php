<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionFeatures extends Model
{
    protected $fillable = [
        "feature_id",
        "subscription_id",
    ];
}
