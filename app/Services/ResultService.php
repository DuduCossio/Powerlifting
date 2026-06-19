<?php

namespace App\Services;

use App\Models\Attempt;
use App\Models\ChampionshipSession;
use App\Models\Group;
use App\Models\Result;
use Illuminate\Support\Collection;

class ResultService
{
    public function syncSessionResults(ChampionshipSession $session): Collection
    {
        $groups = $session->groups()->with(['competitors.attempts'])->get();

        return $groups->flatMap(fn (Group $group) => $this->syncGroupResults($group));
    }

    public function syncGroupResults(Group $group): Collection
    {
        $group->loadMissing('competitors.attempts');

        $results = $group->competitors->map(function ($competitor) {
            return $this->buildResultPayload($competitor->id, $competitor->attempts);
        });

        $sortedResults = $this->sortResultsByTotal($results);

        $position = 0;
        $previousTotal = null;

        return $sortedResults->map(function (array $payload, int $index) use (&$position, &$previousTotal) {
            if ($previousTotal === null || $payload['total'] !== $previousTotal) {
                $position = $index + 1;
            }

            $previousTotal = $payload['total'];
            $payload['position'] = $position;

            return Result::updateOrCreate([
                'competitor_id' => $payload['competitor_id'],
            ], $payload);
        });
    }

    protected function buildResultPayload(int $competitorId, Collection $attempts): array
    {
        $betterSquat = $this->bestSuccessfulAttemptWeight($attempts, Attempt::TYPE_SQUAT);
        $betterBench = $this->bestSuccessfulAttemptWeight($attempts, Attempt::TYPE_BENCH_PRESS);
        $betterDeadlift = $this->bestSuccessfulAttemptWeight($attempts, Attempt::TYPE_DEADLIFT);
        $total = $betterSquat + $betterBench + $betterDeadlift;

        return [
            'competitor_id' => $competitorId,
            'better_squat' => $betterSquat,
            'better_bench' => $betterBench,
            'better_deadlift' => $betterDeadlift,
            'total' => $total,
            'points_ipf' => 0,
            'position' => 0,
        ];
    }

    protected function bestSuccessfulAttemptWeight(Collection $attempts, string $type): float
    {
        $weight = $attempts
            ->where('type', $type)
            ->where('status', 'success')
            ->max('weight');

        return $weight === null ? 0.0 : (float) $weight;
    }

    protected function sortResultsByTotal(Collection $results): Collection
    {
        return $results->sortByDesc(fn (array $payload) => $payload['total'])
            ->values();
    }
}
