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
            $table->string("subscription_id")->primary();
            $table->string('subscription_name');
            $table->decimal('price', 10, 2);
            $table->integer('duration');
            $table->string('description');
            $table->timestamps();
        });

        Subscription::insert([
            [
                'subscription_id' => "SUB0001",
                'subscription_name' => "Basic Plan",
                "price" => 30,
                "duration" => 60,
                "description" => "Starter package for individual sellers",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subscription_id' => "SUB0002",
                'subscription_name' => "Pro Plan",
                "price" => 90,
                "duration" => 60,
                "description" => "For active independent sellers",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subscription_id' => "SUB0003",
                'subscription_name' => "Ultimate Plan",
                "price" => 150,
                "duration" => 60,
                "description" => "For entrepreneur sellers",
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
