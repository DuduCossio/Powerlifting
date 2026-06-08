<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Division;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ageDivisions = [
            ['name' => 'Sub-Junior (14-18)', 'type' => 'Age'],
            ['name' => 'Junior (19-23)',     'type' => 'Age'],
            ['name' => 'Open (24-39)',       'type' => 'Age'],
            ['name' => 'Master I (40-49)',   'type' => 'Age'],
            ['name' => 'Master II (50-59)',  'type' => 'Age'],
            ['name' => 'Master III (60+)',   'type' => 'Age'],
        ];

        foreach ($ageDivisions as $div) {
            Division::create($div);
        }
    }
}
