<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CompetitionUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $current;

    public array $next;

    public function __construct(array $current = [], array $next = [])
    {
        $this->current = $current;
        $this->next = $next;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('competition');
    }

    public function broadcastWith(): array
    {
        return [
            'current' => $this->current,
            'next' => $this->next,
        ];
    }
}
