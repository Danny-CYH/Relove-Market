<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $table = "categories";

    protected $primary_key = "category_id";

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['category_id', 'category_name'];
}
