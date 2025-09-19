<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotions extends Model
{

    protected $primaryKey = "promotion_id";

    public $incrementing = false;

    protected $table = "promotions";

    protected $fillable = [
        "promotion_id",
        "promotion_name",
        "promotion_discount",
        "promotion_type",
        "promotion_startDate",
        "promotion_endDate",
        "promotion_status",
        "promotion_limit",
    ];

    public function productPromotion()
    {
        return $this->belongsTo(ProductPromotion::class, "promotion_id", "promotion_id");
    }
}
