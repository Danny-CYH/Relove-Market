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
            $table->timestamps();
        });

        Subscription::insert([
            [
                'subscription_plan_id' => "PLAN-00001",
                'plan_name' => "Starter Plan",
                "description" => "Perfect for new sellers starting their online business",
                "price" => 4.99,
                "duration" => 60,
                "status" => "Active",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subscription_plan_id' => "PLAN-00002",
                'plan_name' => "Basic Plan",
                "description" => "Great for growing businesses with basic needs",
                "price" => 9.99,
                "duration" => 60,
                "status" => "Active",
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
        Schema::dropIfExists('subscriptions');
    }
};
