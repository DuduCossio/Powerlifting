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
        Schema::table('competition_state', function (Blueprint $table) {
            $table->unsignedInteger('panel_id')->nullable()->after('screen_athlete_data')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('competition_state', function (Blueprint $table) {
            $table->dropIndex(['panel_id']);
            $table->dropColumn('panel_id');
        });
    }
};
