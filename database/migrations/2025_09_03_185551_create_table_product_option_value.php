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
        Schema::create('product_option_value', function (Blueprint $table) {
            $table->string("value_id")->primary();
            $table->string("option_id");
            $table->string("option_value");
            $table->integer("quantity");
            $table->timestamps();

            $table->foreign('option_id')
                ->references('option_id')->on('product_options')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_option_value');
    }
};
