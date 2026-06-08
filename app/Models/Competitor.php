<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'last_name', 'sexo', 'body_weight', 'category_id', 'age'])]
class Competitor extends Model
{
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function attempts()
    {
        return $this->hasMany(Attempt::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
