<?php

namespace Tests\Feature\Admin;

use App\Models\Attempt;
use App\Models\Category;
use App\Models\ChampionshipSession;
use App\Models\Competitor;
use App\Models\Division;
use App\Models\Group;
use App\Models\JudgeVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin time-out marks attempt as timeout and writes invalid votes for all judges', function () {
    $admin = User::factory()->create(['rol' => 'admin']);
    $judgeOne = User::factory()->create(['rol' => 'juez']);
    $judgeTwo = User::factory()->create(['rol' => 'juez']);

    $category = Category::create(['name' => 'Open', 'sexo' => 'M', 'minimum_weight' => 0, 'maximum_weight' => 999]);
    $division = Division::create(['name' => 'Senior', 'type' => 'Open']);
    $session = ChampionshipSession::create(['name' => 'Test', 'date' => now()->format('Y-m-d'), 'start_time' => '09:00:00', 'status' => 'Pendiente']);
    $group = Group::create(['championship_session_id' => $session->id, 'name' => 'A', 'status' => 'Pendiente', 'sort_order' => 1]);

    $competitor = Competitor::create([
        'name' => 'Test',
        'last_name' => 'Competitor',
        'sexo' => 'M',
        'body_weight' => 90,
        'age' => 25,
        'category_id' => $category->id,
        'division_id' => $division->id,
        'group_id' => $group->id,
        'lot_number' => 1,
    ]);

    $attempt = $competitor->attempts()->create([
        'type' => Attempt::TYPE_SQUAT,
        'attempt_number' => 1,
        'weight' => 200,
        'status' => 'success',
    ]);

    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeOne->id, 'vote' => 'valid']);

    $response = $this->actingAs($admin)->postJson(route('admin.queue.time-out'));

    $response->assertStatus(200);
    $response->assertJson(['success' => true, 'locked' => true]);

    expect($attempt->fresh()->status)->toBe(Attempt::STATUS_TIMEOUT);
    expect(JudgeVote::where('attempt_id', $attempt->id)->count())->toBe(2);
    expect(JudgeVote::where('attempt_id', $attempt->id)->pluck('vote')->unique()->values()->all())->toBe(['invalid']);
});
