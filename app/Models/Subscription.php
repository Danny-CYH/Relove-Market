<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $table = "subscriptions";

    protected $primaryKey = "subscription_plan_id";

    public $incrementing = false;

    protected $keyType = "string";

    protected $fillable = [
        'subscription_plan_id',
        'plan_name',
        "description",
        "price",
        "duration",
        "status",
        "limits",
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class, "subscription_plan_id", "subscription_plan_id");
    }

    public function subscriptionFeatures()
    {
        return $this->hasMany(SubscriptionFeatures::class, "subscription_plan_id", "subscription_plan_id");
    }
}
