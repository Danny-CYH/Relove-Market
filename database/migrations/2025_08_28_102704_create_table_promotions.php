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
        Schema::create('promotions', function (Blueprint $table) {
            $table->string("promotion_id")->primary();
            $table->string("promotion_name");
            $table->integer("promotion_discount");
            $table->string("promotion_type");
            $table->dateTime("promotion_startDate");
            $table->dateTime("promotion_endDate");
            $table->string("promotion_status");
            $table->integer("promotion_limit");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
