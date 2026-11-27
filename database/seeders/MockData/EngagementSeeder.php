<?php

namespace Database\Seeders\MockData;

use Database\Seeders\MockData\InsertsMockRows;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class EngagementSeeder extends Seeder
{
    use InsertsMockRows;

    public function run(): void
    {
        $now = now();
        $this->seedRatingsAndLists($now);
        $this->seedConversations($now);
    }

    private function seedRatingsAndLists($now): void
    {
        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $userId = MockDataIds::buyerFor($i);
            $productId = MockDataIds::product($i);
            $variant = json_encode([
                'variant_id' => MockDataIds::variant($i),
            ], JSON_THROW_ON_ERROR);

            $this->insertIfMissing(
                'wishlists',
                ['user_id' => $userId, 'product_id' => $productId],
                [
                    'user_id' => $userId,
                    'product_id' => $productId,
                    'selected_quantity' => 1,
                    'selected_variant' => $variant,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $this->insertIfMissing(
                'cart',
                ['user_id' => $userId, 'product_id' => $productId],
                [
                    'user_id' => $userId,
                    'product_id' => $productId,
                    'selected_quantity' => 1,
                    'selected_variant' => $variant,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $this->insertIfMissing(
                'ratings',
                ['user_id' => $userId, 'product_id' => $productId],
                [
                    'user_id' => $userId,
                    'product_id' => $productId,
                    'rating' => 4 + ($i % 2),
                    'comment' => "Demo review " . sprintf('%02d', $i) . ': item matched its description.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }

    private function seedConversations($now): void
    {
        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $suffix = sprintf('%02d', $i);
            $buyerId = MockDataIds::buyerFor($i);
            $sellerId = MockDataIds::seller($i);
            $productId = MockDataIds::product($i);
            $message = "Demo conversation message {$suffix}.";
            $identity = [
                'buyer_id' => $buyerId,
                'seller_id' => $sellerId,
                'product_id' => $productId,
            ];

            DB::table('conversations')->insertOrIgnore($identity + [
                'last_message' => $message,
                'last_message_at' => $now,
                'unread_count_buyer' => 0,
                'unread_count_seller' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $conversationId = DB::table('conversations')->where($identity)->value('id');
            if ($conversationId === null) {
                throw new RuntimeException("Unable to find seeded conversation {$suffix}.");
            }

            $this->insertIfMissing(
                'messages',
                ['conversation_id' => $conversationId, 'message' => $message],
                [
                    'conversation_id' => $conversationId,
                    'sender_id' => $buyerId,
                    'sender_type' => 'buyer',
                    'message' => $message,
                    'read' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}
