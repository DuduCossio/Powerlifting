<?php

namespace App\Http\Controllers\Admin;

use App\Events\CompetitionUpdated;
use App\Events\ScreenToggled;
use App\Events\VotesUpdated;
use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\CompetitionState;
use App\Models\JudgeVote;
use App\Models\User;
use App\Services\CompetitionQueue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class QueueController extends Controller
{
    public function next(Request $request, CompetitionQueue $competitionQueue)
    {
        $queue = $competitionQueue->getGlobalQueue(Auth::user()->panel_id);

        if ($queue->isEmpty()) {
            return Response::noContent();
        }

        // If admin provided a next_weight for the current attempt, validate votes and persist next attempt
        $nextWeight = $request->input('next_weight');
        $attemptIdFromReq = $request->input('attempt_id') ?? null;
        if ($nextWeight !== null && $attemptIdFromReq) {
            $attemptModel = Attempt::find($attemptIdFromReq);
            if ($attemptModel) {
                $allVotes = JudgeVote::where('attempt_id', $attemptModel->id)
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

                $voteCount = count($allVotes);
                $isTimeout = ($attemptModel->status ?? null) === Attempt::STATUS_TIMEOUT;

                // Require all judges before advancing unless it was a timeout
                if ($voteCount < 3 && ! $isTimeout) {
                    return Response::json(['error' => 'Los votos no están completos'], 422);
                }

                $validCount = collect($allVotes)->where('vote', 'valid')->count();
                $invalidCount = collect($allVotes)->where('vote', 'invalid')->count();

                if (! $isTimeout) {
                    if ($validCount >= 2) {
                        $attemptModel->status = Attempt::STATUS_SUCCESS;
                        $attemptModel->save();
                    } elseif ($invalidCount >= 2) {
                        $attemptModel->status = Attempt::STATUS_FAILED;
                        $attemptModel->save();
                    } else {
                        return Response::json(['error' => 'No hay mayoría de votos'], 422);
                    }

                    // Ensure admin and judges see the final locked state
                    event(new VotesUpdated($attemptModel->id, $allVotes, true, null, Auth::user()->panel_id));
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

        $index = CompetitionState::where('panel_id', Auth::user()->panel_id)->first()?->current_index ?? 0;

        // Incrementar al siguiente intento
        $index = $index + 1;
        if ($index >= $queue->count()) {
            CompetitionState::updateOrCreate(['panel_id' => Auth::user()->panel_id], ['current_index' => $queue->count()]);

            $current = null;
            $next = null;

            event(new CompetitionUpdated([], [], true, Auth::user()->panel_id));

            return Response::json(['finished' => true, 'current' => null, 'next' => null]);
        }

        CompetitionState::updateOrCreate(['panel_id' => Auth::user()->panel_id], ['current_index' => $index]);

        $current = $this->normalizeTimeoutAttempt($queue->get($index));
        $next = $queue->get($index + 1) ?? null;

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

        $nextSummary = null;
        if ($next !== null) {
            $nextSummary = [
                'attempt_id' => $next['attempt_id'] ?? null,
                'competitor_name' => $next['competitor_name'] ?? null,
                'group_name' => $next['group_name'] ?? null,
                'attempt_type' => $next['attempt_type'] ?? null,
                'attempt_number' => $next['attempt_number'] ?? null,
                'weight' => $next['weight'] ?? null,
                'queue_index' => $index + 1,
            ];
        }

        event(new CompetitionUpdated($currentSummary, $nextSummary, false, Auth::user()->panel_id));

        return Response::json(['current' => $currentSummary, 'next' => $nextSummary]);
    }

    public function state(CompetitionQueue $competitionQueue)
    {
        $queue = $competitionQueue->getGlobalQueue(Auth::user()->panel_id);

        if ($queue->isEmpty()) {
            return Response::json(['current' => null, 'next' => null, 'finished' => false]);
        }

        $index = CompetitionState::where('panel_id', Auth::user()->panel_id)->first()?->current_index ?? 0;

        if ($index >= $queue->count()) {
            return Response::json(['current' => null, 'next' => null, 'finished' => true]);
        }

        $current = $this->normalizeTimeoutAttempt($queue->get($index));
        $next = $queue->get($index + 1) ?? null;

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

        $nextSummary = null;
        if ($next !== null) {
            $nextSummary = [
                'attempt_id' => $next['attempt_id'] ?? null,
                'competitor_name' => $next['competitor_name'] ?? null,
                'group_name' => $next['group_name'] ?? null,
                'attempt_type' => $next['attempt_type'] ?? null,
                'attempt_number' => $next['attempt_number'] ?? null,
                'weight' => $next['weight'] ?? null,
                'queue_index' => $index + 1,
            ];
        }

        return Response::json(['current' => $currentSummary, 'next' => $nextSummary, 'finished' => false]);
    }

    public function timeOut(CompetitionQueue $competitionQueue)
    {
        $queue = $competitionQueue->getGlobalQueue(Auth::user()->panel_id);

        if ($queue->isEmpty()) {
            return Response::noContent();
        }

        $index = CompetitionState::where('panel_id', Auth::user()->panel_id)->first()?->current_index ?? 0;

        if ($index >= $queue->count()) {
            return Response::noContent();
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

        event(new VotesUpdated($attempt->id, $allVotes, true, null, Auth::user()->panel_id));

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
        event(new VotesUpdated($attemptId, [], false, null, Auth::user()->panel_id));

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

    public function broadcast(CompetitionQueue $competitionQueue)
    {
        $queue = $competitionQueue->getGlobalQueue(Auth::user()->panel_id);

        if ($queue->isEmpty()) {
            return Response::noContent();
        }

        $index = CompetitionState::where('panel_id', Auth::user()->panel_id)->first()?->current_index ?? 0;

        if ($index >= $queue->count()) {
            return Response::noContent();
        }

        $current = $this->normalizeTimeoutAttempt($queue->get($index));

        $allVotes = JudgeVote::where('attempt_id', $current['attempt_id'] ?? null)
            ->with('user')
            ->get()
            ->map(function ($vote) {
                return [
                    'judge_name' => $vote->user->name ?? 'Desconocido',
                    'vote' => $vote->vote,
                ];
            })
            ->toArray();

        $athleteData = [
            'name' => $current['competitor_name'] ?? 'SIN ATLETA',
            'detail' => $current['group_name'] ?? 'Esperando datos',
            'weightLabel' => ($current['weight'] ?? 0).' kg',
            'votes' => $allVotes,
            'attemptId' => $current['attempt_id'] ?? null,
            'attemptType' => $current['attempt_type'] ?? null,
            'attemptNumber' => $current['attempt_number'] ?? null,
        ];

        event(new ScreenToggled(true, $athleteData, Auth::user()->panel_id));

        // Guardar el estado de la pantalla visible en BD
        CompetitionState::updateOrCreate(
            ['panel_id' => Auth::user()->panel_id],
            [
                'screen_visible' => true,
                'screen_athlete_data' => $athleteData,
            ]
        );

        return Response::json(['success' => true, 'athleteData' => $athleteData]);
    }

    public function clearScreen()
    {
        event(new ScreenToggled(false, null, Auth::user()->panel_id));

        // Guardar el estado de la pantalla no visible en BD
        CompetitionState::updateOrCreate(
            ['panel_id' => Auth::user()->panel_id],
            [
                'screen_visible' => false,
                'screen_athlete_data' => null,
            ]
        );

        return Response::json(['success' => true]);
    }

    public function screenState(Request $request)
    {
        $panelId = $request->query('panel');

        if ($panelId !== null) {
            $state = CompetitionState::where('panel_id', $panelId)->first() ?? CompetitionState::first();
        } else {
            $state = CompetitionState::first();
        }

        return Response::json([
            'isVisible' => $state?->screen_visible ?? false,
            'athleteData' => $state?->screen_athlete_data ?? null,
            'panel' => $panelId,
        ]);
    }
}
