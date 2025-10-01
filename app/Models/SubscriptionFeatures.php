<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionFeatures extends Model
{
    protected $table = "subscriptions_features";

    protected $primaryKey = "feature_id";

    protected $keyType = "string";

    protected $fillable = [
        "feature_id",
        "subscription_plan_id",
        "feature_text",
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class, "subscription_plan_id", "subscription_plan_id");
    }
}
