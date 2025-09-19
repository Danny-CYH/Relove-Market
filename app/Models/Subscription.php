<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $table = "subscriptions";

    protected $primaryKey = "subscription_id";

    protected $keyType = "string";

    protected $fillable = [
        'subscription_id',
        'name',
        'price',
        'duration',
        "description",
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class, "subscription_id", "subscription_id");
    }

    public function subscriptionFeatures()
    {
        return $this->belongsTo(SubscriptionFeatures::class, "subscription_id", "subscription_id");
    }
}
