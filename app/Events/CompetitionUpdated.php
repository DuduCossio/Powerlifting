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

    public ?array $current;

    public ?array $next;

    public bool $finished;

    public ?int $panelId;

    public function __construct(?array $current = null, ?array $next = null, bool $finished = false, ?int $panelId = null)
    {
        $this->current = $current;
        $this->next = $next;
        $this->finished = $finished;
        $this->panelId = $panelId;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('competition'.($this->panelId !== null ? '.'.$this->panelId : ''));
    }

    public function broadcastWith(): array
    {
        return [
            'current' => $this->current,
            'next' => $this->next,
            'finished' => $this->finished,
        ];
    }
}
