<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetitionState extends Model
{
    protected $table = 'competition_state';

    protected $fillable = [
        'current_index',
        'screen_visible',
        'screen_athlete_data',
        'panel_id',
    ];

    protected $casts = [
        'screen_athlete_data' => 'array',
        'screen_visible' => 'boolean',
        'panel_id' => 'integer',
    ];
}
