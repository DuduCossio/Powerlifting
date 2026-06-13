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

test('admin can create a next attempt after three votes', function () {
    $admin = User::factory()->create(['rol' => 'admin']);
    $judgeOne = User::factory()->create(['rol' => 'juez']);
    $judgeTwo = User::factory()->create(['rol' => 'juez']);
    $judgeThree = User::factory()->create(['rol' => 'juez']);

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
    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeTwo->id, 'vote' => 'valid']);
    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeThree->id, 'vote' => 'valid']);

    $response = $this->actingAs($admin)->postJson(route('admin.queue.next'), [
        'attempt_id' => $attempt->id,
        'next_weight' => 210,
    ]);

    $response->assertStatus(200);
    expect(Attempt::where('competitor_id', $competitor->id)
        ->where('type', Attempt::TYPE_SQUAT)
        ->where('attempt_number', 2)
        ->exists())->toBeTrue();
    expect((float) Attempt::where('competitor_id', $competitor->id)
        ->where('type', Attempt::TYPE_SQUAT)
        ->where('attempt_number', 2)
        ->value('weight'))->toBe(210.0);
});

test('admin can create a next attempt when timeout is active', function () {
    $admin = User::factory()->create(['rol' => 'admin']);
    $judgeOne = User::factory()->create(['rol' => 'juez']);
    $judgeTwo = User::factory()->create(['rol' => 'juez']);
    $judgeThree = User::factory()->create(['rol' => 'juez']);

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
        'status' => Attempt::STATUS_TIMEOUT,
    ]);

    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeOne->id, 'vote' => 'invalid']);
    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeTwo->id, 'vote' => 'invalid']);
    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeThree->id, 'vote' => 'invalid']);

    $response = $this->actingAs($admin)->postJson(route('admin.queue.next'), [
        'attempt_id' => $attempt->id,
        'next_weight' => 205,
    ]);

    $response->assertStatus(200);
    expect(Attempt::where('competitor_id', $competitor->id)
        ->where('type', Attempt::TYPE_SQUAT)
        ->where('attempt_number', 2)
        ->exists())->toBeTrue();
});

test('admin cannot create next attempt before three votes unless timeout', function () {
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
    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeTwo->id, 'vote' => 'valid']);

    $response = $this->actingAs($admin)->postJson(route('admin.queue.next'), [
        'attempt_id' => $attempt->id,
        'next_weight' => 210,
    ]);

    $response->assertStatus(422);
    expect(Attempt::where('competitor_id', $competitor->id)
        ->where('type', Attempt::TYPE_SQUAT)
        ->where('attempt_number', 2)
        ->exists())->toBeFalse();
});

test('admin updates existing next attempt when it already exists', function () {
    $admin = User::factory()->create(['rol' => 'admin']);
    $judgeOne = User::factory()->create(['rol' => 'juez']);
    $judgeTwo = User::factory()->create(['rol' => 'juez']);
    $judgeThree = User::factory()->create(['rol' => 'juez']);

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

    $existingNext = $competitor->attempts()->create([
        'type' => Attempt::TYPE_SQUAT,
        'attempt_number' => 2,
        'weight' => 205,
        'status' => Attempt::STATUS_PENDING,
    ]);

    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeOne->id, 'vote' => 'valid']);
    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeTwo->id, 'vote' => 'valid']);
    JudgeVote::create(['attempt_id' => $attempt->id, 'user_id' => $judgeThree->id, 'vote' => 'valid']);

    $response = $this->actingAs($admin)->postJson(route('admin.queue.next'), [
        'attempt_id' => $attempt->id,
        'next_weight' => 210,
    ]);

    $response->assertStatus(200);
    expect((float) $existingNext->fresh()->weight)->toBe(210.0);
});
