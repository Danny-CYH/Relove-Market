<?php

namespace Database\Seeders;

use Database\Seeders\MockData\AccountSeeder;
use Database\Seeders\MockData\CatalogSeeder;
use Database\Seeders\MockData\CommerceSeeder;
use Database\Seeders\MockData\EngagementSeeder;
use Database\Seeders\MockData\ReferenceDataSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $this->call([
                ReferenceDataSeeder::class,
                AccountSeeder::class,
                CatalogSeeder::class,
                CommerceSeeder::class,
                EngagementSeeder::class,
            ]);
        });
    }
}
