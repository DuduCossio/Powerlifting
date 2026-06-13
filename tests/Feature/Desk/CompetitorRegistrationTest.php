<?php

use App\Models\Attempt;
use App\Models\Category;
use App\Models\ChampionshipSession;
use App\Models\Competitor;
use App\Models\Division;
use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use function Pest\Laravel\actingAs;

test('desk can register competitor with first attempts', function () {
    $user = User::create([
        'name' => 'Mesa User',
        'email' => 'mesa@example.com',
        'password' => Hash::make('password'),
        'rol' => 'mesa',
        'status' => true,
    ]);

    $session = ChampionshipSession::create([
        'name' => 'Session Uno',
        'date' => now()->toDateString(),
        'start_time' => now()->format('H:i:s'),
        'status' => 'Pendiente',
    ]);

    $category = Category::create([
        'name' => '+93',
        'sexo' => 'male',
        'minimum_weight' => 93,
        'maximum_weight' => 120,
    ]);

    $division = Division::create([
        'name' => 'Senior',
        'type' => 'Open',
    ]);

    $group = Group::create([
        'championship_session_id' => $session->id,
        'name' => 'A',
        'status' => 'Pendiente',
        'sort_order' => 1,
    ]);

    $response = actingAs($user)->post('/desk/competitors', [
        'name' => 'Juan',
        'last_name' => 'Perez',
        'sexo' => 'male',
        'body_weight' => 82.5,
        'age' => 24,
        'category_id' => $category->id,
        'division_id' => $division->id,
        'group_id' => $group->id,
        'attempts' => [
            ['type' => 'squat', 'attempt_number' => 1, 'weight' => 140, 'status' => 'success'],
            ['type' => 'bench_press', 'attempt_number' => 1, 'weight' => 100, 'status' => 'success'],
            ['type' => 'deadlift', 'attempt_number' => 1, 'weight' => 180, 'status' => 'success'],
        ],
    ]);

    $response->assertStatus(302)->assertSessionHas('success');

    expect(Competitor::count())->toBe(1);
    expect(Attempt::count())->toBe(3);

    $competitor = Competitor::first();

    expect($competitor->division_id)->toBe($division->id);
    expect($competitor->group_id)->toBe($group->id);
    expect($competitor->lot_number)->toBeGreaterThanOrEqual(1);
    expect($competitor->lot_number)->toBeLessThanOrEqual(1000);
    expect((float) $competitor->attempts()->where('type', 'squat')->value('weight'))->toBe(140.0);
    expect((float) $competitor->attempts()->where('type', 'bench_press')->value('weight'))->toBe(100.0);
    expect((float) $competitor->attempts()->where('type', 'deadlift')->value('weight'))->toBe(180.0);
});
