<?php

namespace App\Events;

use App\Models\Product;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ProductUpdated implements ShouldBroadcastNow
{
    public $product;

    public $action;

    public function __construct($product, $action = null)
    {
        $this->product = $product;
        $this->action = $action;
    }

    public function broadcastOn()
    {
        return ['products'];
    }

    public function broadcastAs()
    {
        return 'product.updated';
    }

    public function broadcastWith()
    {
        if ($this->action === 'deleted') {
            // Only send product_id on delete
            return [
                'action' => 'deleted',
                'product_id' => $this->product instanceof Product
                    ? $this->product->product_id
                    : $this->product['product_id'], // handle array payload
            ];
        }

        return [
            'action' => $this->action,
            'product' => $this->product->load([
                'productImage',
                'productVideo',
                'productFeature',
                'productIncludeItem',
                'category'
            ])->toArray(),
        ];
    }
}

