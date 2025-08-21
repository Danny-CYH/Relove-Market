<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $table = "products";

    protected $primary_key = "product_id";

    public $incrementing = false;

    protected $keyType = "string";

    protected $fillable = [
        'product_id',
        "product_name",
        'product_description',
        'product_price',
        'product_condition',
        'product_quantity',
        'product_status',
        'seller_id',
        'category_id',
    ];

    public function category()
    {
        return $this->hasOne(Category::class, 'category_id', 'category_id');
    }

    public function productImage()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'product_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }
}
