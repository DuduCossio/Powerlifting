<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'date', 'start_time', 'status'])]
class ChampionshipSession extends Model
{
    public function groups()
    {
        return $this->hasMany(Group::class);
    }
}
