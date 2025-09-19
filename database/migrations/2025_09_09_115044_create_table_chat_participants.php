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
        Schema::create('chat_participants', function (Blueprint $table) {
            $table->integer("participant_id")->primary();
            $table->integer("conversation_id");
            $table->string("seller_id");
            $table->string("buyer_id");
            $table->boolean("is_active");
            $table->timestamp("last_read_at");
            $table->timestamp("joined_at");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_participants');
    }
};
