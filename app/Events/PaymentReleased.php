<?php
// app/Events/PaymentReleased.php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReleased implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $orderId;
    public $amount;
    public $sellerId;
    public $releasedAt;

    /**
     * Create a new event instance.
     */
    public function __construct($orderId, $amount, $sellerId, $releasedAt)
    {
        $this->orderId = $orderId;
        $this->amount = $amount;
        $this->sellerId = $sellerId;
        $this->releasedAt = $releasedAt;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("seller.orders.{$this->sellerId}"),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'payment.released';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->orderId,
            'amount' => $this->amount,
            'released_at' => $this->releasedAt,
            'message' => "Payment for order #{$this->orderId} has been released to your account.",
            'timestamp' => now()->toISOString(),
        ];
    }
}