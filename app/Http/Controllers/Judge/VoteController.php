<?php

namespace App\Http\Controllers\Judge;

use App\Events\VotesUpdated;
use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\JudgeVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class VoteController extends Controller
{
    public function create()
    {
        return inertia('Judge/Index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'attempt_id' => 'required|integer|exists:attempts,id',
            'vote' => 'required|in:valid,invalid',
        ]);

        $attempt = Attempt::find($validated['attempt_id']);

        if ($attempt === null || $attempt->status === Attempt::STATUS_TIMEOUT) {
            return Response::json([
                'success' => false,
                'message' => 'Este intento ya no acepta votos.',
            ], 422);
        }

        $currentUserId = Auth::id();

        $vote = JudgeVote::firstOrCreate([
            'user_id' => $currentUserId,
            'attempt_id' => $validated['attempt_id'],
        ], [
            'vote' => $validated['vote'],
        ]);

        $allVotes = JudgeVote::where('attempt_id', $validated['attempt_id'])
            ->with('user')
            ->get()
            ->map(function ($v) {
                return [
                    'judge_id' => $v->user_id,
                    'judge_name' => $v->user->name ?? 'Juez',
                    'vote' => $v->vote,
                ];
            })
            ->toArray();

        // Broadcast the personal vote so the voting judge can be immediately blocked locally
        event(new VotesUpdated($validated['attempt_id'], $allVotes, false, $currentUserId));

        // Determine majority (>=2) and finalize attempt status if reached
        $validCount = collect($allVotes)->where('vote', 'valid')->count();
        $invalidCount = collect($allVotes)->where('vote', 'invalid')->count();

        $attempt = Attempt::find($validated['attempt_id']);
        if ($attempt) {
            if ($validCount >= 2) {
                $attempt->status = Attempt::STATUS_SUCCESS;
                $attempt->save();
            } elseif ($invalidCount >= 2) {
                $attempt->status = Attempt::STATUS_FAILED;
                $attempt->save();
            }
        }

        return Response::json(['success' => true, 'votes' => $allVotes, 'judge_id' => $currentUserId]);
    }
}
