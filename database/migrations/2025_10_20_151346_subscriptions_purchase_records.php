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
        Schema::create('subscription_purchase_records', function (Blueprint $table) {
            $table->string("receipt_id")->unique();
            $table->string('payment_intent_id')->unique();
            $table->double("amount");
            $table->string("currency")->default("myr");
            $table->string('user_id');
            $table->string('seller_id');
            $table->string('subscription_plan_id');
            $table->string("payment_status");
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_purchase_records');
    }
};
