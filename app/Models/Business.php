<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $table = "business";

    protected $fillable = [
        "business_id",
        "business_type",
        "business_description",
    ];
}
