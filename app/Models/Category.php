<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'sexo', 'minimum_weight', 'maximum_weight'])]
class Category extends Model
{
    public function competitors()
    {
        return $this->hasMany(Competitor::class);
    }
}
