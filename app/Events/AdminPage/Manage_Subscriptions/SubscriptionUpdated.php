<?php

namespace App\Events\AdminPage\Manage_Subscriptions;

use App\Models\Subscription;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubscriptionUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $subscription;

    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription->load('subscriptionFeatures');
    }

    public function broadcastOn()
    {
        return new Channel('subscriptions');
    }

    public function broadcastAs()
    {
        return 'subscription.updated';
    }

    public function broadcastWith()
    {
        return [
            'subscription' => $this->subscription
        ];
    }
}
