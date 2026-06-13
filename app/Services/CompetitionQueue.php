<?php

namespace App\Services;

use App\Models\Attempt;
use App\Models\ChampionshipSession;
use App\Models\Group;
use Illuminate\Support\Collection;

class CompetitionQueue
{
    public function groupsForLatestSession(): Collection
    {
        $today = now()->startOfDay();

        $sessionToday = ChampionshipSession::query()
            ->where('date', $today->format('Y-m-d'))
            ->first();

        if ($sessionToday !== null) {
            $latestDate = $sessionToday->date;
        } else {
            $latestDate = ChampionshipSession::query()
                ->where('date', '<', $today->format('Y-m-d'))
                ->orderByDesc('date')
                ->value('date');

            if ($latestDate === null) {
                $latestDate = ChampionshipSession::query()
                    ->where('date', '>', $today->format('Y-m-d'))
                    ->orderBy('date')
                    ->value('date');
            }
        }

        if ($latestDate === null) {
            return collect();
        }

        $groups = Group::with(['championshipSession', 'competitors.category', 'competitors.division', 'competitors.attempts'])
            ->whereHas('championshipSession', function ($query) use ($latestDate) {
                $query->where('date', $latestDate);
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return collect($groups->map(function (Group $group) {
            return [
                'group' => $group->toArray(),
                'queue' => $this->buildGroupQueue($group)->toArray(),
            ];
        }));
    }

    protected function buildGroupQueue(Group $group): Collection
    {
        $orderedAttemptTypes = [
            Attempt::TYPE_SQUAT => [1, 2, 3],
            Attempt::TYPE_BENCH_PRESS => [1, 2, 3],
            Attempt::TYPE_DEADLIFT => [1, 2, 3],
        ];

        return collect($orderedAttemptTypes)
            ->flatMap(function (array $attemptNumbers, string $type) use ($group) {
                return collect($attemptNumbers)
                    ->flatMap(function (int $attemptNumber) use ($group, $type) {
                        return $this->orderedAttemptRows($group, $type, $attemptNumber);
                    });
            })
            ->values();
    }

    protected function orderedAttemptRows(Group $group, string $type, int $attemptNumber): Collection
    {
        return $group->competitors
            ->map(function ($competitor) use ($type, $attemptNumber) {
                $attempt = $competitor->attempts
                    ->first(function ($attempt) use ($type, $attemptNumber) {
                        return $attempt->type === $type && $attempt->attempt_number === $attemptNumber;
                    });

                return [
                    'competitor' => $competitor,
                    'attempt' => $attempt,
                ];
            })
            ->filter(function ($entry) {
                return $entry['attempt'] !== null;
            })
            ->sortBy(function ($entry) {
                return [
                    (float) $entry['attempt']->weight,
                    $entry['competitor']->lot_number,
                ];
            })
            ->values()
            ->map(function ($entry) use ($group, $type, $attemptNumber) {
                return [
                    'attempt_id' => $entry['attempt']->id,
                    'group_id' => $group->id,
                    'group_name' => $group->name,
                    'competitor_id' => $entry['competitor']->id,
                    'competitor_name' => sprintf('%s %s', $entry['competitor']->last_name, $entry['competitor']->name),
                    'competitor_category' => $entry['competitor']->category?->name,
                    'competitor_division' => $entry['competitor']->division?->name,
                    'attempt_type' => $type,
                    'attempt_number' => $attemptNumber,
                    'weight' => (float) $entry['attempt']->weight,
                    'lot_number' => $entry['competitor']->lot_number,
                    'status' => $entry['attempt']->status,
                ];
            });
    }
}
