<?php

namespace Database\Seeders\MockData;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReferenceDataSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('roles')->insertOrIgnore([
            [
                'role_id' => 'ReLo-B0001',
                'role_name' => 'Buyer',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'role_id' => 'ReLo-S0001',
                'role_name' => 'Seller',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'role_id' => 'ReLo-A0001',
                'role_name' => 'Admin',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $categoryNames = [
            'Clothing & Accessories',
            'Electronics & Gadgets',
            'Home & Furniture',
            'Baby & Kids',
            'Books & Stationery',
            'Sports & Outdoors',
            'Beauty & Self-Care',
            'Art & Collectibles',
            'Jewelry & Watches',
            'Vehicles & Bikes',
            'Eco-Friendly Items',
            'Others',
            'Toys & Games',
            'Music & Audio',
            'Kitchen & Dining',
            'Pet Supplies',
            'Garden & Plants',
            'Travel & Luggage',
            'Handmade & Crafts',
            'Office & Learning',
        ];

        $categories = [];
        foreach ($categoryNames as $index => $categoryName) {
            $categories[] = [
                'category_id' => MockDataIds::category($index + 1),
                'category_name' => $categoryName,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('categories')->insertOrIgnore($categories);

        $businessTypes = [
            'Casual Seller',
            'Home Declutter',
            'Fashion & Clothing',
            'Electronics & Gadgets',
            'Books & Media',
            'Hobby & Collectibles',
            'Sports & Fitness',
            'Kids & Baby Items',
            'Home & Kitchen',
            'Creative Crafts',
            'Beauty & Personal Care',
            'Gaming & Entertainment',
            'Small Business Owner',
            'Student Seller',
            'Gardening & Outdoor',
            'Pet Supplies',
            'Tools & DIY',
            'Local Artisan',
            'Seasonal Seller',
            'Just Getting Started',
        ];

        $businesses = [];
        foreach ($businessTypes as $index => $businessType) {
            $businesses[] = [
                'business_id' => MockDataIds::business($index + 1),
                'business_type' => $businessType,
                'business_description' => "Demo business profile for {$businessType}.",
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('business')->insertOrIgnore($businesses);
    }
}
