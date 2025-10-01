<?php

namespace App\Events\AdminPage\Manage_Subscriptions;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubscriptionDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $subscriptionPlanId;

    public function __construct($subscriptionPlanId)
    {
        $this->subscriptionPlanId = $subscriptionPlanId;
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
        return 'subscription.deleted';
    }

    public function broadcastWith()
    {
        return [
            'subscription_plan_id' => $this->subscriptionPlanId
        ];
    }
}
