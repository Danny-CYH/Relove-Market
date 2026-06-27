<?php

namespace App\Events\SellerPage\SellerManageProduct;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public mixed $product,
        public string $action
    ) {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('products');
    }

    public function broadcastAs(): string
    {
        return 'product.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'product' => $this->product,
            'action' => $this->action,
        ];
    }
}
