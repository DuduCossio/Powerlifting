<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'type'])]
class Division extends Model
{
    public function competitors()
    {
        return $this->hasMany(Competitor::class);
    }
}
