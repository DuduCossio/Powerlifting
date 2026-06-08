<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Competitor;
use App\Models\Category;
use App\Models\Division;
use App\Models\Group;

class CompetitorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener categorías por sexo
        $maleCategories = Category::where('sexo', 'M')->get();
        $femaleCategories = Category::where('sexo', 'F')->get();
        
        // Grupos disponibles
        $groups = Group::all();

        // Competidores masculinos (sin división de equipamiento por ahora)
        $maleCompetitors = [
            ['name' => 'Juan', 'last_name' => 'Pérez', 'body_weight' => 72.5, 'age' => 28, 'category' => '-74kg', 'lot' => 101],
            ['name' => 'Carlos', 'last_name' => 'López', 'body_weight' => 88.2, 'age' => 32, 'category' => '-93kg', 'lot' => 102],
            ['name' => 'Miguel', 'last_name' => 'García', 'body_weight' => 65.3, 'age' => 24, 'category' => '-66kg', 'lot' => 103],
            ['name' => 'Luis', 'last_name' => 'Martínez', 'body_weight' => 110.0, 'age' => 35, 'category' => '-120kg', 'lot' => 104],
            ['name' => 'Andrés', 'last_name' => 'Rodríguez', 'body_weight' => 95.7, 'age' => 29, 'category' => '-105kg', 'lot' => 105],
        ];

        // Competidoras femeninas
        $femaleCompetitors = [
            ['name' => 'María', 'last_name' => 'Fernández', 'body_weight' => 55.2, 'age' => 26, 'category' => '-57kg', 'lot' => 201],
            ['name' => 'Laura', 'last_name' => 'Sánchez', 'body_weight' => 60.8, 'age' => 30, 'category' => '-63kg', 'lot' => 202],
            ['name' => 'Ana', 'last_name' => 'Ramírez', 'body_weight' => 49.5, 'age' => 22, 'category' => '-52kg', 'lot' => 203],
            ['name' => 'Sofía', 'last_name' => 'Torres', 'body_weight' => 71.3, 'age' => 27, 'category' => '-76kg', 'lot' => 204],
        ];

        // Crear competidores (masculinos y femeninos)
        $this->createCompetitors($maleCompetitors, $maleCategories, $groups);
        $this->createCompetitors($femaleCompetitors, $femaleCategories, $groups);
    }

    /**
     * Crear competidores asignando división por edad automáticamente.
     */
    private function createCompetitors(array $competitorsData, $categories, $groups): void
    {
        $groupCount = $groups->count();
        $groupIndex = 0;

        foreach ($competitorsData as $data) {
            // Buscar la categoría por peso
            $category = $categories->firstWhere('name', $data['category']);
            if (!$category) {
                continue;
            }

            // Determinar la división por edad según la edad del competidor
            $divisionId = $this->getAgeDivisionId($data['age']);
            if (!$divisionId) {
                continue; // Si no encuentra división, saltar (no debería ocurrir)
            }

            // Asignar grupo de forma rotativa
            $group = $groups[$groupIndex % $groupCount];
            $groupIndex++;

            Competitor::create([
                'category_id'  => $category->id,
                'division_id'  => $divisionId,
                'group_id'     => $group->id,
                'name'         => $data['name'],
                'last_name'    => $data['last_name'],
                'sexo'         => $category->sexo,
                'body_weight'  => $data['body_weight'],
                'age'          => $data['age'],
                'lot_number'   => $data['lot'],
            ]);
        }
    }

    /**
     * Devuelve el ID de la división por edad según la edad.
     * Asegúrate de que los nombres coincidan con los de DivisionSeeder.
     */
    private function getAgeDivisionId(int $age): ?int
    {
        if ($age >= 14 && $age <= 18) {
            return Division::where('name', 'Sub-Junior (14-18)')->first()?->id;
        }
        if ($age >= 19 && $age <= 23) {
            return Division::where('name', 'Junior (19-23)')->first()?->id;
        }
        if ($age >= 24 && $age <= 39) {
            return Division::where('name', 'Open (24-39)')->first()?->id;
        }
        if ($age >= 40 && $age <= 49) {
            return Division::where('name', 'Master I (40-49)')->first()?->id;
        }
        if ($age >= 50 && $age <= 59) {
            return Division::where('name', 'Master II (50-59)')->first()?->id;
        }
        if ($age >= 60) {
            return Division::where('name', 'Master III (60+)')->first()?->id;
        }
        return null; // Edad fuera de rango (menor a 14, por ejemplo)
    }
}
