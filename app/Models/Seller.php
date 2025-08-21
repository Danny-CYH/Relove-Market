<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    protected $table = "sellers";

    protected $primaryKey = "seller_id";

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "seller_id",
        "seller_name",
        "seller_email",
        "seller_phone",
        "store_id",
        "business_id",
        "subscription_id",
    ];

    public function sellerStore()
    {
        return $this->hasMany(SellerStore::class);
    }
}
