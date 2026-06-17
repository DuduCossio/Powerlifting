<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScreenToggled implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public bool $isVisible;

    public ?array $athleteData;

    public function __construct(bool $isVisible = false, ?array $athleteData = null)
    {
        $this->isVisible = $isVisible;
        $this->athleteData = $athleteData;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('competition');
    }

    public function broadcastWith(): array
    {
        return [
            'isVisible' => $this->isVisible,
            'athleteData' => $this->athleteData,
        ];
    }
}
