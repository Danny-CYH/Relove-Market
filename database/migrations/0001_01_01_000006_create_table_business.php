<?php

use App\Models\Business;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business', function (Blueprint $table) {
            $table->string("business_id")->primary();
            $table->string("business_type");
            $table->string("business_description");
            $table->timestamps();
        });

        Business::insert([
            [
                "business_id" => "BUS001",
                "business_type" => "Independent Seller",
                "business_description" => "Inviduals selling their own second-hand or preloved items directly to buyers.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS002",
                "business_type" => "Thrift Store",
                "business_description" => "Shops, often charity-based, that sell donated or second-hand items at affordable prices.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS003",
                "business_type" => "Consignment Business",
                "business_description" => "Businesses that sell items on behalf of owners and share profits after a sucessful sale.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS004",
                "business_type" => "Vintage Shop",
                "business_description" => "Stores specializing in curated older items, especially fashion and collectibles from past decades.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS005",
                "business_type" => "Eco-Friendly Brand",
                "business_description" => "Sustainable businesses promoting reuse and recycling through resale of second-hand or returned products.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS006",
                "business_type" => "Refurbished Electronics Seller",
                "business_description" => "Vendors that repair, restore, and resell used electronic devices like phone, laptops, and tablets.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS007",
                "business_type" => "Home Goods Reseller",
                "business_description" => "Businesses that deal in used furniture, kitchenware, or decorative items for the home.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS008",
                "business_type" => "Fashion & Apparel",
                "business_description" => "Sellers focusing on preloved clothes, shoes, accessories, and handbags.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS009",
                "business_type" => "Books & Media Seller",
                "business_description" => "Vendors offering second-hands books, magazines, movies or educational materials.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS010",
                "business_type" => "DIY & Upcycled Goods",
                "business_description" => "Creative businesses that redesign or repurpose old items into sellable products.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS011",
                "business_type" => "Furniture & Decor",
                "business_description" => "Shops that resell or restore used furniture, lighting, wall art, and other interior items.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "business_id" => "BUS012",
                "business_type" => "Children & Baby Products",
                "business_description" => "Sellers offering preloved toys, clothes, gear, and accessories for babies and kids.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business');
    }
};
