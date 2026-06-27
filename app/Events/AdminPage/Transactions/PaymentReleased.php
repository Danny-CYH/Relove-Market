<?php

namespace App\Events\AdminPage\Transactions;

use App\Models\SellerEarning;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReleased implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public SellerEarning $transaction)
    {
        $this->transaction->loadMissing(['seller', 'order']);
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('seller.payment.' . $this->transaction->seller_id);
    }

    public function broadcastAs(): string
    {
        return 'payment.released';
    }

    public function broadcastWith(): array
    {
        return [
            'transaction' => $this->transaction,
            'seller_earning' => $this->transaction,
            'order' => $this->transaction->order,
            'message' => 'Payment has been released for order ' . $this->transaction->order_id,
        ];
    }
}
