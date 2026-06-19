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

    public ?int $panelId;

    public function __construct(bool $isVisible = false, ?array $athleteData = null, ?int $panelId = null)
    {
        $this->isVisible = $isVisible;
        $this->athleteData = $athleteData;
        $this->panelId = $panelId;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('competition'.($this->panelId !== null ? '.'.$this->panelId : ''));
    }

    public function broadcastWith(): array
    {
        return [
            'isVisible' => $this->isVisible,
            'athleteData' => $this->athleteData,
        ];
    }
}
