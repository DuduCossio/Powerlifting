<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['championship_session_id', 'name', 'status', 'sort_order'])]
class Group extends Model
{
    public function championshipSession()
    {
        return $this->belongsTo(ChampionshipSession::class);
    }

    public function competitors()
    {
        return $this->hasMany(Competitor::class);
    }
}
