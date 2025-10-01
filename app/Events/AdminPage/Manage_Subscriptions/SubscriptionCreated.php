<?php

namespace App\Events\AdminPage\Manage_Subscriptions;

use App\Models\Subscription;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubscriptionCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $subscription;

    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription->load("subscriptionFeatures");
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return ["subscriptions"];
    }

    public function broadcastAs()
    {
        return 'subscription.created';
    }

    public function broadcastWith()
    {
        return [
            'subscription' => $this->subscription
        ];
    }
}
