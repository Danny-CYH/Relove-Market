<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatParticipants extends Model
{
    protected $primaryKey = "participant_id";

    protected $fillable = [
        "participant_id",
        "conversation_id",
        "seller_id",
        "customer_id",
        "is_active",
        "last_read_at",
        "joined_at",
    ];
}
