<?php

use App\Models\Attempt;
use App\Models\Category;
use App\Models\ChampionshipSession;
use App\Models\Competitor;
use App\Models\Division;
use App\Models\Group;
use App\Services\CompetitionQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it builds grouped queue rows for the most recent session ordered by attempt weight and lot number', function () {
    $category = Category::create(['name' => 'Open', 'sexo' => 'M', 'minimum_weight' => 0, 'maximum_weight' => 999]);
    $division = Division::create(['name' => 'Senior', 'type' => 'Open']);

    $sessionOld = ChampionshipSession::create(['name' => 'Old Session', 'date' => '2025-01-01', 'start_time' => '09:00:00', 'status' => 'Pendiente']);
    $sessionRecent = ChampionshipSession::create(['name' => 'Recent Session', 'date' => '2026-06-01', 'start_time' => '09:00:00', 'status' => 'Pendiente']);

    $groupOld = Group::create(['championship_session_id' => $sessionOld->id, 'name' => 'A', 'status' => 'Pendiente', 'sort_order' => 1]);
    $groupRecent = Group::create(['championship_session_id' => $sessionRecent->id, 'name' => 'B', 'status' => 'Pendiente', 'sort_order' => 1]);

    $competitorOne = Competitor::create([
        'name' => 'Carlos',
        'last_name' => 'Rodríguez',
        'sexo' => 'M',
        'body_weight' => 92.4,
        'age' => 28,
        'category_id' => $category->id,
        'division_id' => $division->id,
        'group_id' => $groupRecent->id,
        'lot_number' => 5,
    ]);
    $competitorTwo = Competitor::create([
        'name' => 'Ana',
        'last_name' => 'Martínez',
        'sexo' => 'F',
        'body_weight' => 85.0,
        'age' => 26,
        'category_id' => $category->id,
        'division_id' => $division->id,
        'group_id' => $groupRecent->id,
        'lot_number' => 3,
    ]);

    $competitorOne->attempts()->create(['type' => Attempt::TYPE_SQUAT, 'attempt_number' => 1, 'weight' => 220, 'status' => 'success']);
    $competitorTwo->attempts()->create(['type' => Attempt::TYPE_SQUAT, 'attempt_number' => 1, 'weight' => 220, 'status' => 'success']);
    $competitorOne->attempts()->create(['type' => Attempt::TYPE_SQUAT, 'attempt_number' => 2, 'weight' => 230, 'status' => 'success']);
    $competitorTwo->attempts()->create(['type' => Attempt::TYPE_SQUAT, 'attempt_number' => 2, 'weight' => 225, 'status' => 'success']);
    $competitorOne->attempts()->create(['type' => Attempt::TYPE_BENCH_PRESS, 'attempt_number' => 1, 'weight' => 140, 'status' => 'success']);
    $competitorTwo->attempts()->create(['type' => Attempt::TYPE_BENCH_PRESS, 'attempt_number' => 1, 'weight' => 150, 'status' => 'success']);

    $queue = (new CompetitionQueue)->groupsForLatestSession();

    expect($queue)->toHaveCount(1);

    $rows = $queue->first()['queue'];

    expect($rows->first()['competitor_id'])->toBe($competitorTwo->id);
    expect($rows->first()['attempt_type'])->toBe(Attempt::TYPE_SQUAT);
    expect($rows->first()['attempt_number'])->toBe(1);

    expect($rows->where('attempt_type', Attempt::TYPE_SQUAT)->where('attempt_number', 2)->first()['competitor_id'])->toBe($competitorTwo->id);
    expect($rows->where('attempt_type', Attempt::TYPE_BENCH_PRESS)->where('attempt_number', 1)->first()['competitor_id'])->toBe($competitorOne->id);
    expect($rows->pluck('attempt_type')->filter(fn ($type) => $type === Attempt::TYPE_DEADLIFT))->toBeEmpty();
});
