<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'plan_name',
        'price',
        'start_date',
        'end_date',
        'status'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
