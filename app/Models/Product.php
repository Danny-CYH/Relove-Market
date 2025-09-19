<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $table = "products";

    protected $primaryKey = "product_id";

    public $incrementing = false;

    protected $keyType = "string";

    protected $fillable = [
        'product_id',
        "product_name",
        'product_description',
        'product_price',
        'product_quantity',
        'product_status',
        'product_condition',
        'product_brand',
        'product_material',
        'product_manufacturer',
        'product_weight',
        'seller_id',
        'category_id',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class, "seller_id", "seller_id");
    }

    public function category()
    {
        return $this->HasOne(Category::class, "category_id", "category_id");
    }

    public function promotions()
    {
        return $this->hasMany(Promotions::class, 'promotion_id', 'promotion_id');
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

    public function productFeature()
    {
        return $this->hasMany(ProductFeature::class, "product_id", 'product_id');
    }

    public function productOption()
    {
        return $this->hasMany(ProductOption::class, "product_id", "product_id");
    }

    public function productIncludeItem()
    {
        return $this->hasMany(ProductIncludeItem::class, 'product_id', 'product_id');
    }

    public function productImage()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'product_id');
    }

    public function productVideo()
    {
        return $this->hasMany(ProductVideo::class, 'product_id', 'product_id');
    }

    public function productPromotion()
    {
        return $this->belongsTo(ProductPromotion::class, "product_id", "product_id");
    }

    public function productEmbeddings()
    {
        return $this->hasMany(ProductEmbeddings::class, "product_id", "product_id");
    }
}
