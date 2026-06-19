<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['championship_session_id', 'name', 'status', 'sort_order', 'panel_id'])]
class Group extends Model
{
    public function championshipSession()
    {
        return $this->belongsTo(ChampionshipSession::class);
    }

    public function panel()
    {
        return $this->belongsTo(Panel::class);
    }

    public function competitors()
    {
        return $this->hasMany(Competitor::class);
    }
}
