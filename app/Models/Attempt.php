<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['competitor_id', 'type', 'attempt_number', 'weight', 'status'])]
class Attempt extends Model
{
    public const TYPE_SQUAT = 'squat';

    public const TYPE_BENCH_PRESS = 'bench_press';

    public const TYPE_DEADLIFT = 'deadlift';

    public const STATUS_PENDING = 'pending';

    public const STATUS_TIMEOUT = 'timeout';

    public function competitor()
    {
        return $this->belongsTo(Competitor::class);
    }
}
