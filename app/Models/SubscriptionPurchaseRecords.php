<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPurchaseRecords extends Model
{
    protected $primaryKey = "receipt_id";

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = "subscription_purchase_records";

    protected $fillable = [
        'receipt_id',
        'payment_intent_id',
        'amount',
        'currency',
        'user_id',
        'seller_id',
        'subscription_plan_id',
        'payment_status',
    ];

    public static function generateReceiptId()
    {
        return 'RCP-' . date('Ymd') . '-' . strtoupper(uniqid());
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class, 'subscription_plan_id');
    }

}
