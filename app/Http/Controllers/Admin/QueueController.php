<?php

namespace App\Http\Controllers\Admin;

use App\Events\CompetitionUpdated;
use App\Events\VotesUpdated;
use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\JudgeVote;
use App\Models\User;
use App\Services\CompetitionQueue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;

class QueueController extends Controller
{
    public function next(Request $request, CompetitionQueue $competitionQueue)
    {
        $queue = $competitionQueue->getGlobalQueue();

        if ($queue->isEmpty()) {
            return Response::noContent();
        }

        // If admin provided a next_weight for the current attempt, validate votes and persist next attempt
        $nextWeight = $request->input('next_weight');
        $attemptIdFromReq = $request->input('attempt_id') ?? null;
        if ($nextWeight !== null && $attemptIdFromReq) {
            $attemptModel = Attempt::find($attemptIdFromReq);
            if ($attemptModel) {
                $voteCount = JudgeVote::where('attempt_id', $attemptModel->id)->count();
                $isTimeout = ($attemptModel->status ?? null) === Attempt::STATUS_TIMEOUT;
                if ($voteCount < 3 && ! $isTimeout) {
                    return Response::json(['error' => 'Los votos no están completos'], 422);
                }

                $nextAttemptNumber = ($attemptModel->attempt_number ?? 0) + 1;
                if ($nextAttemptNumber <= 3) {
                    $existing = Attempt::where('competitor_id', $attemptModel->competitor_id)
                        ->where('type', $attemptModel->type)
                        ->where('attempt_number', $nextAttemptNumber)
                        ->first();

                    if ($existing) {
                        $existing->weight = $nextWeight;
                        $existing->save();
                    } else {
                        Attempt::create([
                            'competitor_id' => $attemptModel->competitor_id,
                            'type' => $attemptModel->type,
                            'attempt_number' => $nextAttemptNumber,
                            'weight' => $nextWeight,
                            'status' => Attempt::STATUS_PENDING,
                        ]);
                    }
                }
            }
        }

        $cacheKey = 'competition_current_index';
        $index = Cache::get($cacheKey, 0);

        // Si el índice está fuera de rango, resetear a 0
        if ($index >= $queue->count()) {
            $index = 0;
            Cache::put($cacheKey, $index);
        }

        $index = $index + 1;
        if ($index >= $queue->count()) {
            $index = 0;
        }

        Cache::put($cacheKey, $index);

        $current = $this->normalizeTimeoutAttempt($queue->get($index));
        $next = $queue->get($index + 1) ?? $queue->get(0);

        $currentSummary = [
            'attempt_id' => $current['attempt_id'] ?? null,
            'competitor_name' => $current['competitor_name'] ?? null,
            'group_name' => $current['group_name'] ?? null,
            'attempt_type' => $current['attempt_type'] ?? null,
            'attempt_number' => $current['attempt_number'] ?? null,
            'weight' => $current['weight'] ?? null,
            'locked' => ($current['status'] ?? null) === Attempt::STATUS_TIMEOUT,
            'queue_index' => $index,
        ];

        $nextIndex = $index + 1;
        if ($nextIndex >= $queue->count()) {
            $nextIndex = 0;
        }

        $nextSummary = [
            'attempt_id' => $next['attempt_id'] ?? null,
            'competitor_name' => $next['competitor_name'] ?? null,
            'group_name' => $next['group_name'] ?? null,
            'attempt_type' => $next['attempt_type'] ?? null,
            'attempt_number' => $next['attempt_number'] ?? null,
            'weight' => $next['weight'] ?? null,
            'queue_index' => $nextIndex,
        ];

        event(new CompetitionUpdated($currentSummary, $nextSummary));

        return Response::json(['current' => $currentSummary, 'next' => $nextSummary]);
    }

    public function state(CompetitionQueue $competitionQueue)
    {
        $queue = $competitionQueue->getGlobalQueue();

        if ($queue->isEmpty()) {
            return Response::json(['current' => null, 'next' => null]);
        }

        $cacheKey = 'competition_current_index';
        $index = Cache::get($cacheKey, 0);

        // Si el índice está fuera de rango, resetear a 0
        if ($index >= $queue->count()) {
            $index = 0;
            Cache::put($cacheKey, $index);
        }

        $current = $this->normalizeTimeoutAttempt($queue->get($index));
        $next = $queue->get($index + 1) ?? $queue->get(0);

        $currentSummary = [
            'attempt_id' => $current['attempt_id'] ?? null,
            'competitor_name' => $current['competitor_name'] ?? null,
            'group_name' => $current['group_name'] ?? null,
            'attempt_type' => $current['attempt_type'] ?? null,
            'attempt_number' => $current['attempt_number'] ?? null,
            'weight' => $current['weight'] ?? null,
            'locked' => ($current['status'] ?? null) === Attempt::STATUS_TIMEOUT,
            'queue_index' => $index,
        ];

        $nextIndex = $index + 1;
        if ($nextIndex >= $queue->count()) {
            $nextIndex = 0;
        }

        $nextSummary = [
            'attempt_id' => $next['attempt_id'] ?? null,
            'competitor_name' => $next['competitor_name'] ?? null,
            'group_name' => $next['group_name'] ?? null,
            'attempt_type' => $next['attempt_type'] ?? null,
            'attempt_number' => $next['attempt_number'] ?? null,
            'weight' => $next['weight'] ?? null,
            'queue_index' => $nextIndex,
        ];

        return Response::json(['current' => $currentSummary, 'next' => $nextSummary]);
    }

    public function timeOut(CompetitionQueue $competitionQueue)
    {
        $queue = $competitionQueue->getGlobalQueue();

        if ($queue->isEmpty()) {
            return Response::noContent();
        }

        $cacheKey = 'competition_current_index';
        $index = Cache::get($cacheKey, 0);

        // Si el índice está fuera de rango, resetear a 0
        if ($index >= $queue->count()) {
            $index = 0;
            Cache::put($cacheKey, $index);
        }

        $current = $queue->get($index);
        $attemptId = $current['attempt_id'] ?? null;

        if ($attemptId === null) {
            return Response::noContent();
        }

        $attempt = Attempt::find($attemptId);

        if ($attempt === null) {
            return Response::noContent();
        }

        $attempt->status = Attempt::STATUS_TIMEOUT;
        $attempt->save();

        $judgeIds = User::where('rol', 'juez')->pluck('id');

        foreach ($judgeIds as $userId) {
            JudgeVote::updateOrCreate(
                ['attempt_id' => $attempt->id, 'user_id' => $userId],
                ['vote' => 'invalid']
            );
        }

        $allVotes = JudgeVote::where('attempt_id', $attempt->id)
            ->with('user')
            ->get()
            ->map(function ($vote) {
                return [
                    'judge_id' => $vote->user_id,
                    'judge_name' => $vote->user->name ?? 'Juez',
                    'vote' => $vote->vote,
                ];
            })
            ->toArray();

        event(new VotesUpdated($attempt->id, $allVotes, true));

        return Response::json([
            'success' => true,
            'attempt_id' => $attempt->id,
            'locked' => true,
            'votes' => $allVotes,
        ]);
    }

    public function getVotes($attemptId)
    {
        $votes = JudgeVote::where('attempt_id', $attemptId)
            ->with('user')
            ->get()
            ->map(function ($vote) {
                return [
                    'judge_id' => $vote->user_id,
                    'judge_name' => $vote->user->name ?? 'Juez',
                    'vote' => $vote->vote,
                ];
            })
            ->toArray();

        return Response::json(['votes' => $votes]);
    }

    public function clearVotes(Request $request)
    {
        $attemptId = $request->input('attempt_id');

        if ($attemptId === null) {
            return Response::json(['error' => 'attempt_id requerido'], 422);
        }

        $attempt = Attempt::find($attemptId);
        if ($attempt === null) {
            return Response::json(['error' => 'Intento no encontrado'], 404);
        }

        // Eliminar todos los votos para este intento
        JudgeVote::where('attempt_id', $attemptId)->delete();

        // Resetear el status a PENDING para permitir nuevos votos
        $attempt->status = Attempt::STATUS_PENDING;
        $attempt->save();

        // Emitir evento para notificar a los jueces que los votos fueron eliminados
        event(new VotesUpdated($attemptId, [], false));

        return Response::json(['success' => true, 'message' => 'Votos eliminados']);
    }

    protected function normalizeTimeoutAttempt(array $attemptEntry): array
    {
        if (! isset($attemptEntry['attempt_id']) || ! isset($attemptEntry['status'])) {
            return $attemptEntry;
        }

        $voteCount = JudgeVote::where('attempt_id', $attemptEntry['attempt_id'])->count();

        if ($voteCount === 0 && $attemptEntry['status'] === Attempt::STATUS_TIMEOUT) {
            $attempt = Attempt::find($attemptEntry['attempt_id']);
            if ($attempt !== null) {
                $attempt->status = Attempt::STATUS_PENDING;
                $attempt->save();
            }

            $attemptEntry['status'] = Attempt::STATUS_PENDING;
        }

        return $attemptEntry;
    }
}
