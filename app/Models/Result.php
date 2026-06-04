<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['competitor_id', 'better_squat', 'better_bench', 'better_deadlift', 'total', 'points_gl', 'position'])]
class Result extends Model
{
    public function competitor()
    {
        return $this->belongsTo(Competitor::class);
    }
}
