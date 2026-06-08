<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $maleCategories = [
            ['name' => '-59kg', 'sexo' => 'M', 'minimum_weight' => 0,    'maximum_weight' => 59],
            ['name' => '-66kg', 'sexo' => 'M', 'minimum_weight' => 59,   'maximum_weight' => 66],
            ['name' => '-74kg', 'sexo' => 'M', 'minimum_weight' => 66,   'maximum_weight' => 74],
            ['name' => '-83kg', 'sexo' => 'M', 'minimum_weight' => 74,   'maximum_weight' => 83],
            ['name' => '-93kg', 'sexo' => 'M', 'minimum_weight' => 83,   'maximum_weight' => 93],
            ['name' => '-105kg', 'sexo' => 'M', 'minimum_weight' => 93,  'maximum_weight' => 105],
            ['name' => '-120kg', 'sexo' => 'M', 'minimum_weight' => 105, 'maximum_weight' => 120],
            ['name' => '+120kg', 'sexo' => 'M', 'minimum_weight' => 120, 'maximum_weight' => 999.99],
        ];

        // Categorías femeninas
        $femaleCategories = [
            ['name' => '-47kg', 'sexo' => 'F', 'minimum_weight' => 0,    'maximum_weight' => 47],
            ['name' => '-52kg', 'sexo' => 'F', 'minimum_weight' => 47,   'maximum_weight' => 52],
            ['name' => '-57kg', 'sexo' => 'F', 'minimum_weight' => 52,   'maximum_weight' => 57],
            ['name' => '-63kg', 'sexo' => 'F', 'minimum_weight' => 57,   'maximum_weight' => 63],
            ['name' => '-69kg', 'sexo' => 'F', 'minimum_weight' => 63,   'maximum_weight' => 69],
            ['name' => '-76kg', 'sexo' => 'F', 'minimum_weight' => 69,   'maximum_weight' => 76],
            ['name' => '-84kg', 'sexo' => 'F', 'minimum_weight' => 76,   'maximum_weight' => 84],
            ['name' => '+84kg', 'sexo' => 'F', 'minimum_weight' => 84,   'maximum_weight' => 999.99],
        ];

        foreach (array_merge($maleCategories, $femaleCategories) as $cat) {
            Category::create($cat);
        }
    }
}
