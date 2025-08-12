<?php

namespace App\Events;

use App\Models\SellerRegistration;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SellerRegistered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $seller;

    public function __construct(SellerRegistration $seller)
    {
        $this->seller = $seller->load('business');
    }

    // broadcast to one or more channels (array is fine)
    public function broadcastOn()
    {
        return [new Channel('pending-seller-list')];
    }

    // optional: makes listening on frontend predictable
    public function broadcastAs()
    {
        return 'SellerRegistered';
    }

    public function broadcastWith()
    {
        return [
            'seller' => $this->seller
        ];
    }
}
