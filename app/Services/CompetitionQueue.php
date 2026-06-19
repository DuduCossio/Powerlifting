<?php

namespace App\Services;

use App\Models\Attempt;
use App\Models\ChampionshipSession;
use App\Models\Group;
use Illuminate\Support\Collection;

class CompetitionQueue
{
    public function groupsForLatestSession(?int $panelId = null): Collection
    {
        $latestDate = $this->resolveLatestSessionDate($panelId);

        if ($latestDate === null) {
            return collect();
        }

        $groups = $this->querySessionGroups($latestDate, $panelId);
        $globalQueue = $this->buildGlobalQueue($groups)->toArray();

        return collect($groups->map(function (Group $group) use ($globalQueue) {
            return [
                'group' => $group->toArray(),
                'queue' => $this->buildGroupQueue($group)->toArray(),
                'globalQueue' => $globalQueue,
            ];
        }));
    }

    public function getGlobalQueue(?int $panelId = null): Collection
    {
        $latestDate = $this->resolveLatestSessionDate($panelId);

        if ($latestDate === null) {
            return collect();
        }

        $groups = $this->querySessionGroups($latestDate, $panelId);

        return $this->buildGlobalQueue($groups);
    }

    protected function resolveLatestSessionDate(?int $panelId = null): ?string
    {
        $today = now()->startOfDay();

        $sessionToday = ChampionshipSession::query()
            ->where('date', $today->format('Y-m-d'))
            ->first();

        if ($sessionToday !== null) {
            return $sessionToday->date;
        }

        $latestDate = ChampionshipSession::query()
            ->where('date', '<', $today->format('Y-m-d'))
            ->orderByDesc('date')
            ->value('date');

        if ($latestDate !== null) {
            return $latestDate;
        }

        $sessions = ChampionshipSession::query()
            ->where('date', '>', $today->format('Y-m-d'))
            ->orderBy('date')
            ->get();

        foreach ($sessions as $session) {
            $query = Group::where('championship_session_id', $session->id)
                ->whereHas('competitors.attempts');

            if ($panelId !== null) {
                $query->where('panel_id', $panelId);
            }

            if ($query->exists()) {
                return $session->date;
            }
        }

        return null;
    }

    protected function querySessionGroups(string $latestDate, ?int $panelId = null): Collection
    {
        return Group::with(['championshipSession', 'competitors.category', 'competitors.division', 'competitors.attempts'])
            ->when($panelId !== null, function ($query) use ($panelId) {
                $query->where('panel_id', $panelId);
            })
            ->whereHas('championshipSession', function ($query) use ($latestDate) {
                $query->where('date', $latestDate);
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    protected function buildGlobalQueue($groups): Collection
    {
        $queue = collect();

        // Iterar: Squat 1, Squat 2, Squat 3, Bench 1, 2, 3, Deadlift 1, 2, 3
        $attemptSequence = [
            [Attempt::TYPE_SQUAT, 1],
            [Attempt::TYPE_SQUAT, 2],
            [Attempt::TYPE_SQUAT, 3],
            [Attempt::TYPE_BENCH_PRESS, 1],
            [Attempt::TYPE_BENCH_PRESS, 2],
            [Attempt::TYPE_BENCH_PRESS, 3],
            [Attempt::TYPE_DEADLIFT, 1],
            [Attempt::TYPE_DEADLIFT, 2],
            [Attempt::TYPE_DEADLIFT, 3],
        ];

        // Para cada grupo, recolectar todos los intentos en orden
        foreach ($groups as $group) {
            foreach ($attemptSequence as [$type, $attemptNumber]) {
                $queue = $queue->merge($this->orderedAttemptRows($group, $type, $attemptNumber));
            }
        }

        return $queue->values();
    }

    protected function buildGroupQueue(Group $group): Collection
    {
        $queue = collect();

        // Squat: intentos 1, 2, 3
        for ($attemptNum = 1; $attemptNum <= 3; $attemptNum++) {
            $queue = $queue->merge($this->orderedAttemptRows($group, Attempt::TYPE_SQUAT, $attemptNum));
        }

        // Bench Press: intentos 1, 2, 3
        for ($attemptNum = 1; $attemptNum <= 3; $attemptNum++) {
            $queue = $queue->merge($this->orderedAttemptRows($group, Attempt::TYPE_BENCH_PRESS, $attemptNum));
        }

        // Deadlift: intentos 1, 2, 3
        for ($attemptNum = 1; $attemptNum <= 3; $attemptNum++) {
            $queue = $queue->merge($this->orderedAttemptRows($group, Attempt::TYPE_DEADLIFT, $attemptNum));
        }

        return $queue->values();
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
