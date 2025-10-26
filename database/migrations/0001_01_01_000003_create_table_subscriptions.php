<?php

use App\Models\Subscription;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->string("subscription_plan_id")->primary();
            $table->string('plan_name');
            $table->string("description");
            $table->decimal('price', 10, 2);
            $table->integer('duration');
            $table->string('status');
            $table->json('limits')->nullable();
            $table->timestamps();
        });

        Subscription::insert([
            [
                'subscription_plan_id' => "PLAN-TRIAL",
                'plan_name' => "Trial Plan",
                "description" => "Perfect for new sellers starting their online business for the first try.",
                "price" => 0.00,
                "duration" => 7,
                "status" => "Active",
                'created_at' => now(),
                'updated_at' => now(),
                "limits" => json_encode(["free trial" => "No limits"]),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
