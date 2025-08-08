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
        Schema::create('items', function (Blueprint $table) {
            $table->string('item_id')->primary();
            $table->string('item_title');
            $table->text('item_description');
            $table->decimal('item_price', 10, 2);
            $table->enum('item_condition', ['new', 'used', 'very-used']);
            $table->integer('item_quantity')->default(1);
            $table->enum('item_status', ['available', 'sold', 'archived'])->default('available');
            $table->string('seller_id');
            $table->string('category_id');
            $table->timestamps();

            $table->foreign('seller_id')->references('seller_id')->on('sellers')->onDelete('cascade');
            $table->foreign('category_id')->references('category_id')->on('category')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
