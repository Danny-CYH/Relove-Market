<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatConversations extends Model
{
    protected $primaryKey = "conversation_id";

    protected $fillable = [
        "conversation_id",
        "product_id",
        "subject",
        "status",
        "last_message_at",
    ];
}
