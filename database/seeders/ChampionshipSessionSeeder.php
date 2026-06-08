<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChampionshipSession;

class ChampionshipSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sessions = [
            [
                'name'       => 'Sesión 1 - Mañana',
                'date'       => now()->addDays(7)->toDateString(), // dentro de 1 semana
                'start_time' => '09:00:00',
                'status'     => 'Pendiente',
            ],
            [
                'name'       => 'Sesión 2 - Tarde',
                'date'       => now()->addDays(7)->toDateString(),
                'start_time' => '14:00:00',
                'status'     => 'Pendiente',
            ],
            [
                'name'       => 'Sesión 3 - Final',
                'date'       => now()->addDays(8)->toDateString(),
                'start_time' => '10:00:00',
                'status'     => 'Pendiente',
            ],
        ];

        foreach ($sessions as $session) {
            ChampionshipSession::create($session);
        }
    }
}
