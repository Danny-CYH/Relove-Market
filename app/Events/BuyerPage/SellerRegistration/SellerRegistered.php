<?php

namespace App\Events\BuyerPage\SellerRegistration;

use App\Models\SellerRegistration;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SellerRegistered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public SellerRegistration $seller,
        public string $action
    ) {
        $this->seller->loadMissing('business');
    }

    public function broadcastOn(): Channel
    {
        return new Channel('pending-seller-list');
    }

    public function broadcastAs(): string
    {
        return 'SellerRegistered';
    }

    public function broadcastWith(): array
    {
        return [
            'seller' => $this->seller,
            'action' => $this->action,
        ];
    }
}
