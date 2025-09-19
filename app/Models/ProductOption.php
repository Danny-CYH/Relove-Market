<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOption extends Model
{
    protected $table = "product_options";

    protected $primaryKey = "option_id";

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['option_id', 'product_id', 'option_name'];

    public function product()
    {
        return $this->belongsTo(Product::class, "product_id", "product_id");
    }

    public function productOptionValue()
    {
        return $this->hasMany(ProductOptionValue::class, "option_id", "option_id");
    }
}
