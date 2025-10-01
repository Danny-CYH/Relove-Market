<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('user.{userId}.buyer', function ($user, $userId) {
    return (string) $user->user_id === (string) $userId;
});

Broadcast::channel('user.{sellerId}.seller', function ($user, $sellerId) {
    return (string) $user->seller_id === (string) $sellerId;
});

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = \App\Models\Conversation::find($conversationId);

    if (!$conversation) {
        return false;
    }

    return $user->user_id === $conversation->buyer_id ||
        $user->user_id === $conversation->sender_id; // use user_id for both
});