<?php

namespace Database\Seeders\MockData;

use Database\Seeders\MockData\InsertsMockRows;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogSeeder extends Seeder
{
    use InsertsMockRows;

    private const PRODUCT_NAMES = [
        'Vintage Denim Jacket',
        'Minimalist Table Lamp',
        'Wireless Headphones',
        'Canvas Backpack',
        'Ceramic Coffee Set',
        'Classic Wristwatch',
        'Running Shoes',
        'Hardcover Novel Collection',
        'Bamboo Storage Basket',
        'Compact Digital Camera',
        'Reusable Water Bottle',
        'Knit Cardigan',
        'Desk Organizer',
        'Yoga Mat',
        'Leather Crossbody Bag',
        'Bluetooth Speaker',
        'Kids Storybook Set',
        'Stainless Steel Pan',
        'Silver Pendant Necklace',
        'Travel Luggage Set',
    ];

    private const PRODUCT_IMAGES = [
        'vintage-denim-jacket.jpg',
        'table-lamp.jpg',
        'wireless-headphones.jpg',
        'canvas-backpack.jpg',
        'ceramic-coffee-set.jpg',
        'classic-wristwatch.jpg',
        'running-shoes.jpg',
        'hardcover-novel-collection.jpg',
        'bamboo-storage-basket.webp',
        'digital-camera.jpg',
        'reusable-water-bottle.jpg',
        'knit-cardigan.jpg',
        'desk-organizer.jpg',
        'yoga-mat.jpg',
        'leather-crossbody-bag.jpg',
        'bluetooth-speaker.jpg',
        'kids-storybook-set.jpg',
        'stainless-steel-pan.jpg',
        'silver-pendant-necklace.jpg',
        'travel-luggage-set.jpg',
    ];

    public function run(): void
    {
        $now = now();
        $this->seedProducts($now);
        $this->seedProductDetails($now);
    }

    private function seedProducts($now): void
    {
        $conditions = ['Like New', 'Good', 'Fair'];
        $products = [];

        foreach (self::PRODUCT_NAMES as $index => $name) {
            $i = $index + 1;
            $suffix = sprintf('%02d', $i);
            $products[] = [
                'product_id' => MockDataIds::product($i),
                'product_name' => $name,
                'product_description' => "Demo preloved item {$suffix}. Clean, inspected, and ready for a new owner.",
                'product_price' => number_format(15 + ($i * 4.25), 2, '.', ''),
                'product_condition' => $conditions[$index % count($conditions)],
                'product_quantity' => 2 + ($i % 5),
                'product_status' => 'available',
                'featured' => $i <= 12,
                'flash_sale' => $i <= 5,
                'total_ratings' => 4.5,
                'seller_id' => MockDataIds::seller($i),
                'category_id' => MockDataIds::category($i),
                'blocked_at' => null,
                'block_reason' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('products')->insertOrIgnore($products);
    }

    private function seedProductDetails($now): void
    {
        $colors = ['Black', 'Blue', 'Cream', 'Green', 'Brown'];
        $sizes = ['S', 'M', 'L', 'One Size'];
        $categories = DB::table('categories')->orderBy('category_id')->pluck('category_name')->all();
        $images = [];
        $features = [];
        $includedItems = [];
        $variants = [];
        $embeddings = [];

        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $suffix = sprintf('%02d', $i);
            $productId = MockDataIds::product($i);
            $color = $colors[($i - 1) % count($colors)];
            $size = $sizes[($i - 1) % count($sizes)];
            $variantId = MockDataIds::variant($i);
            $variantCombination = ['Color' => $color, 'Size' => $size];

            $images[] = [
                'product_id' => $productId,
                'image_path' => 'product-images/' . self::PRODUCT_IMAGES[$i - 1],
                'created_at' => $now,
                'updated_at' => $now,
            ];
            $this->insertIfMissing(
                'product_videos',
                ['product_id' => $productId, 'video_path' => "/videos/mock-product-{$suffix}.mp4"],
                [
                    'product_id' => $productId,
                    'video_path' => "/videos/mock-product-{$suffix}.mp4",
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
            $features[] = [
                'feature_id' => "FEATURE-{$suffix}",
                'product_id' => $productId,
                'feature_text' => 'Gently used and carefully checked',
                'created_at' => $now,
                'updated_at' => $now,
            ];
            $includedItems[] = [
                'item_id' => "ITEM-{$suffix}",
                'product_id' => $productId,
                'item_name' => 'Main item and standard accessories',
                'created_at' => $now,
                'updated_at' => $now,
            ];
            $variants[] = [
                'variant_id' => $variantId,
                'product_id' => $productId,
                'variant_combination' => json_encode($variantCombination, JSON_THROW_ON_ERROR),
                'variant_key' => strtolower(str_replace(' ', '-', "{$color}-{$size}")),
                'quantity' => 3,
                'price' => number_format(19 + $i, 2, '.', ''),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $embedding = array_fill(0, 512, 0.0);
            $embedding[$i - 1] = 1.0;
            $embeddings[] = [
                'product_id' => $productId,
                'name' => self::PRODUCT_NAMES[$i - 1],
                'embedding' => json_encode($embedding, JSON_THROW_ON_ERROR),
                'category' => $categories[$i - 1] ?? 'Others',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach ($images as $image) {
            $existingImage = DB::table('product_images')
                ->where('product_id', $image['product_id'])
                ->orderBy('id')
                ->first();

            if ($existingImage) {
                DB::table('product_images')
                    ->where('id', $existingImage->id)
                    ->update([
                        'image_path' => $image['image_path'],
                        'updated_at' => $now,
                    ]);
            } else {
                DB::table('product_images')->insert($image);
            }
        }

        DB::table('product_features')->insertOrIgnore($features);
        DB::table('product_include_item')->insertOrIgnore($includedItems);
        DB::table('product_variants')->insertOrIgnore($variants);
        DB::table('product_embeddings')->insertOrIgnore($embeddings);
    }
}
