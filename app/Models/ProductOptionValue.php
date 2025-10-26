<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOptionValue extends Model
{
    protected $table = "product_option_value";

    protected $primaryKey = 'value_id'; // 👈 tell Laravel your PK column

    public $incrementing = false;         // 👈 if it's auto-increment

    protected $keyType = 'string';

    protected $fillable = [
        "value_id",
        "option_id",
        "option_value",
        "quantity",
    ];

    public function productOption()
    {
        return $this->belongsTo(ProductOption::class, "option_id", "option_id");
    }
}
