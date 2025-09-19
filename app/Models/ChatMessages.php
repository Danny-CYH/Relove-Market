<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessages extends Model
{
    protected $primaryKey = "message_id";

    protected $fillable = [
        "message_id",
        "conversation_id",
        "sender_id",
        "message_type",
        "content",
        "attachment_url",
        "is_read",
    ];
}
