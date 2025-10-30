<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('product_id')->primary();
            $table->string('product_name');
            $table->text('product_description');
            $table->decimal('product_price', 10, 2);
            $table->string('product_condition');
            $table->integer('product_quantity')->default(1);
            $table->string('product_status');
            $table->string('product_brand');
            $table->string('product_material');
            $table->string('product_manufacturer');
            $table->decimal('product_weight');
            $table->float("shipping_fee")->nullable();
            $table->boolean("featured")->default(false);
            $table->boolean("flash_sale")->default(false);
            $table->float("total_ratings")->default(0);
            $table->string('seller_id');
            $table->string('category_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
