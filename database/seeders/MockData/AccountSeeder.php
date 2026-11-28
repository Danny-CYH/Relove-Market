<?php

namespace Database\Seeders\MockData;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $this->seedStores($now);
        $this->seedSellers($now);
        $this->seedUsers($now);
        $this->seedSellerRegistrations($now);
    }

    private function seedStores($now): void
    {
        $stores = [];
        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $suffix = sprintf('%02d', $i);
            $stores[] = [
                'store_id' => MockDataIds::store($i),
                'store_name' => "Demo Store {$suffix}",
                'store_description' => "A sample store for preloved goods {$suffix}.",
                'store_address' => "{$i} Demo Street",
                'store_phone' => sprintf('000000%04d', $i),
                'store_image' => '/image/user.png',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('seller_stores')->insertOrIgnore($stores);
    }

    private function seedSellers($now): void
    {
        $sellers = [];
        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $suffix = sprintf('%02d', $i);
            $sellers[] = [
                'seller_id' => MockDataIds::seller($i),
                'seller_name' => "Demo Seller {$suffix}",
                'seller_email' => "demo.seller{$suffix}@example.test",
                'seller_phone' => sprintf('000000%04d', 100 + $i),
                'store_id' => MockDataIds::store($i),
                'business_id' => MockDataIds::business($i),
                'is_verified' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('sellers')->insertOrIgnore($sellers);
    }

    private function seedUsers($now): void
    {
        $users = [];
        $password = Hash::make('DemoPass123!');

        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $suffix = sprintf('%02d', $i);
            $isAdmin = $i === 1;
            $isBuyer = $i >= 2 && $i <= 10;
            $sellerNumber = $i - 10;

            $users[] = [
                'user_id' => MockDataIds::user($i),
                'name' => $isAdmin
                    ? 'Demo Admin'
                    : ($isBuyer ? "Demo Buyer {$suffix}" : 'Demo Seller ' . sprintf('%02d', $sellerNumber)),
                'email' => $isAdmin
                    ? 'demo.admin@example.test'
                    : ($isBuyer
                        ? "demo.buyer{$suffix}@example.test"
                        : 'demo.seller' . sprintf('%02d', $sellerNumber) . '@example.test'),
                'email_verified_at' => $now,
                'password' => $password,
                'remember_token' => null,
                'role_id' => $isAdmin
                    ? 'ReLo-A0001'
                    : ($isBuyer ? 'ReLo-B0001' : 'ReLo-S0001'),
                'seller_id' => $isBuyer || $isAdmin
                    ? null
                    : MockDataIds::seller($sellerNumber),
                'status' => 'Active',
                'last_login_at' => null,
                'phone' => sprintf('000000%04d', $i),
                'address' => "{$i} Demo Street",
                'city' => 'Kuala Lumpur',
                'zip_code' => '50000',
                'profile_image' => '/image/user.png',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('users')->insertOrIgnore($users);
    }

    private function seedSellerRegistrations($now): void
    {
        $statuses = ['Pending', 'Approved', 'Rejected'];
        $verificationTypes = ['nric', 'passport', 'business_registration', 'driving_license'];
        $registrations = [];

        for ($i = 1; $i <= MockDataIds::COUNT; $i++) {
            $suffix = sprintf('%02d', $i);
            $registrations[] = [
                'registration_id' => "REG-{$suffix}",
                'name' => "Demo Applicant {$suffix}",
                'email' => "demo.registration{$suffix}@example.test",
                'phone_number' => sprintf('000000%04d', 200 + $i),
                'store_name' => "Demo Registration Store {$suffix}",
                'store_description' => "Sample seller registration {$suffix}.",
                'store_address' => "{$i} Demo Street",
                'store_city' => 'Kuala Lumpur',
                'store_state' => 'Kuala Lumpur',
                'business_id' => MockDataIds::business($i),
                'verification_type' => $verificationTypes[($i - 1) % count($verificationTypes)],
                'verification_image' => '/image/user.png',
                'status' => $statuses[($i - 1) % count($statuses)],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('seller_registrations')->insertOrIgnore($registrations);
    }
}
