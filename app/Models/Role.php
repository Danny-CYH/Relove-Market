<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Role extends Model
{
    protected $table = "role";
    protected $fillable = [
        'role_id',
        'role_name'
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
