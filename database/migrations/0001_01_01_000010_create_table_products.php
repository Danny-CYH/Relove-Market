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
            $table->string('seller_id');
            $table->string('category_id');
            $table->timestamps();

            $table->foreign('seller_id')->references('seller_id')->on('sellers')->onDelete('cascade');
            $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade');
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
