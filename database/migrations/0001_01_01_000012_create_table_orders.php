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
        Schema::create('orders', function (Blueprint $table) {
            $table->string("order_id")->primary();
            $table->string('buyer_id');
            $table->string('seller_id');
            $table->string('item_id');
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'paid', 'shipped', 'done'])->default('pending');
            $table->timestamps();

            $table->foreign('buyer_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('seller_id')->references('seller_id')->on('sellers')->onDelete('cascade');
            $table->foreign('item_id')->references('item_id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
