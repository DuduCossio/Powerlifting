<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VotesUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $attemptId;

    public array $votes;

    public bool $locked;

    public ?int $judgeId;

    public function __construct(int $attemptId, array $votes = [], bool $locked = false, ?int $judgeId = null)
    {
        $this->attemptId = $attemptId;
        $this->votes = $votes;
        $this->locked = $locked;
        $this->judgeId = $judgeId;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('competition');
    }

    public function broadcastWith(): array
    {
        return [
            'attemptId' => $this->attemptId,
            'votes' => $this->votes,
            'locked' => $this->locked,
            'judgeId' => $this->judgeId,
        ];
    }
}
