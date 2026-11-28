<?php

namespace Database\Seeders\MockData;

use Database\Seeders\MockData\InsertsMockRows;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommerceSeeder extends Seeder
{
    use InsertsMockRows;

    public function run(): void
    {
        $now = now();
        $this->seedOrders($now);
        $this->seedOrderItemsAndEarnings($now);
    }

    private function seedOrders($now): void
    {
        $statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed'];
        $orders = [];

        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $suffix = sprintf('%02d', $i);
            $orders[] = [
                'order_id' => MockDataIds::order($i),
                'payment_intent_id' => "pi_{$suffix}",
                'amount' => number_format(15 + ($i * 4.25) + 5, 2, '.', ''),
                'currency' => 'myr',
                'user_id' => MockDataIds::buyerFor($i),
                'seller_id' => MockDataIds::seller($i),
                'payment_method' => 'cod',
                'payment_status' => 'paid',
                'order_status' => $statuses[($i - 1) % count($statuses)],
                'notes' => 'Demo transaction only; no real payment was processed.',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('orders')->insertOrIgnore($orders);
    }

    private function seedOrderItemsAndEarnings($now): void
    {
        $colors = ['Black', 'Blue', 'Cream', 'Green', 'Brown'];
        $sizes = ['S', 'M', 'L', 'One Size'];

        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $orderId = MockDataIds::order($i);
            $productId = MockDataIds::product($i);
            $sellerId = MockDataIds::seller($i);
            $price = 15 + ($i * 4.25);
            $suffix = sprintf('%02d', $i);
            $color = $colors[($i - 1) % count($colors)];
            $size = $sizes[($i - 1) % count($sizes)];
            $variant = json_encode([
                'variant_id' => MockDataIds::variant($i),
                'variant_key' => strtolower(str_replace(' ', '-', "{$color}-{$size}")),
            ], JSON_THROW_ON_ERROR);

            $this->insertIfMissing(
                'order_items',
                ['order_id' => $orderId, 'product_id' => $productId],
                [
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'quantity' => 1,
                    'price' => number_format($price, 2, '.', ''),
                    'selected_variant' => $variant,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $commission = round($price * 0.08, 2);
            $this->insertIfMissing(
                'seller_earnings',
                ['seller_id' => $sellerId, 'order_id' => $orderId],
                [
                    'seller_id' => $sellerId,
                    'order_id' => $orderId,
                    'amount' => number_format($price, 2, '.', ''),
                    'commission_rate' => 0.08,
                    'commission_deducted' => number_format($commission, 2, '.', ''),
                    'payout_amount' => number_format($price - $commission, 2, '.', ''),
                    'status' => 'Pending',
                    'processed_at' => null,
                    'paid_at' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}
