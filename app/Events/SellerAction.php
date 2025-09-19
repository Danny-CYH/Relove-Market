<?php

namespace App\Events;

use App\Models\SellerRegistration;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SellerAction implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $sellerRegistered;
    public $action;

    /**
     * Create a new event instance.
     */
    public function __construct(SellerRegistration $sellerRegistered, string $action)
    {
        $this->sellerRegistered = $sellerRegistered;
        $this->action = $action;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return ['sellerRegistered'];
    }

    public function broadcastAs()
    {
        return 'sellerRegistered.updated';
    }

    public function broadcastWith()
    {
        return [
            "sellerRegistered" => $this->sellerRegistered->toArray(),
            "action" => $this->action,
        ];
    }
}
