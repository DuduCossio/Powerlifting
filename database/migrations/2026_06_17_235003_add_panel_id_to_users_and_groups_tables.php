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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('panel_id')->nullable()->constrained()->nullOnDelete()->after('rol');
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->foreignId('panel_id')->nullable()->constrained()->nullOnDelete()->after('championship_session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('panel_id');
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->dropConstrainedForeignId('panel_id');
        });
    }
};
