<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerRegistration extends Model
{
    protected $primaryKey = "registration_id";
    protected $table = "seller_registrations";

    protected $fillable = [
        "registration_id",
        "name",
        "email",
        "phone_number",
        "store_name",
        "store_license",
        "store_description",
        "store_address",
        "store_city",
        "store_state",
        "business_id",
        "status",
    ];

    // In SellerRegistration model
    public function business()
    {
        return $this->belongsTo(Business::class, 'business_id', 'business_id');
    }

}
