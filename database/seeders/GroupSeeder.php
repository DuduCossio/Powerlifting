<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\ChampionshipSession;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sessions = ChampionshipSession::all();

        foreach ($sessions as $index => $session) {
            // Cada sesión tendrá 2 grupos
            $groups = [
                ['name' => 'Grupo A', 'sort_order' => 1],
                ['name' => 'Grupo B', 'sort_order' => 2],
            ];

            foreach ($groups as $groupData) {
                Group::create([
                    'championship_session_id' => $session->id,
                    'name'                    => $groupData['name'],
                    'status'                  => 'Pendiente',
                    'sort_order'              => $groupData['sort_order'],
                ]);
            }
        }
    }
}
