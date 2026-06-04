<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['competitor_id', 'type', 'attempt_number', 'weight', 'status'])]
class Attempt extends Model
{
    public function competitor()
    {
        return $this->belongsTo(Competitor::class);
    }
}
