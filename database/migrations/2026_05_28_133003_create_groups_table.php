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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('championship_session_id')
                ->constrained('championship_sessions') // Apunta explícitamente a la tabla
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('status')->default('Pendiente');
            $table->unsignedInteger('sort_order')->default(1); // Orden de ejecución dentro de la sesión
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
