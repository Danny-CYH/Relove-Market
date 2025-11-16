<?php
// app/Events/PaymentReleased.php

namespace App\Events;

use App\Models\SellerEarning;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;   // <-- ADD THIS

class PaymentReleased implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $transaction;

    /**
     * Create a new event instance.
     */
    public function __construct(SellerEarning $transaction)
    {
        $this->transaction = $transaction;

        // 🔥 LOG WHEN EVENT IS CREATED
        Log::info("PaymentReleased Event Created", [
            "seller_id" => $transaction->seller_id,
            "order_id" => $transaction->order_id,
            "amount" => $transaction->amount ?? null,
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        // 🔥 LOG WHICH CHANNEL THIS EVENT IS BROADCASTED TO
        Log::info("PaymentReleased Event Broadcasting On Channel", [
            "channel" => "seller.payment.{$this->transaction->seller_id}",
        ]);

        return [
            new PrivateChannel("seller.payment.{$this->transaction->seller_id}"),
        ];
    }

    public function broadcastAs()
    {
        return 'payment.released';
    }

    /**
     * Get the broadcasted data.
     */
    public function broadcastWith()
    {
        // 🔥 LOG THE EXACT PAYLOAD SENT TO FRONTEND
        Log::info("PaymentReleased Broadcast Data", [
            "seller_earning" => $this->transaction,
            "message" => "Payment for order #{$this->transaction->order_id} has been released.",
        ]);

        return [
            "seller_earning" => $this->transaction,
            "message" => "Payment for order #{$this->transaction->order_id} has been released to your account.",
        ];
    }
}
