<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('competition_state', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('current_index')->default(0);
            $table->boolean('screen_visible')->default(false);
            $table->json('screen_athlete_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_state');
    }
};
