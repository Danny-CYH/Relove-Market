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
        Schema::create('sellers', function (Blueprint $table) {
            $table->string("seller_id")->primary();
            $table->string("seller_name");
            $table->string("seller_email")->unique();
            $table->string("seller_phone");
            $table->string('store_id');
            $table->string('business_id');
            $table->string('subscription_id')->nullable();
            $table->timestamps();

            $table->foreign("store_id")->references('store_id')->on('seller_stores')->onDelete('cascade');
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->foreign('subscription_id')->references('subscription_id')->on('subscriptions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
