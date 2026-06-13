<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'last_name', 'sexo', 'body_weight', 'category_id', 'lot_number', 'division_id', 'group_id', 'age'])]
class Competitor extends Model
{
    protected static function booted(): void
    {
        static::creating(function (Competitor $competitor) {
            if ($competitor->lot_number === null) {
                $competitor->lot_number = self::generateUniqueLotNumber();
            }
        });
    }

    protected static function generateUniqueLotNumber(): int
    {
        $attempts = 0;

        do {
            $lotNumber = random_int(1, 1000);
            $attempts++;

            if (! self::where('lot_number', $lotNumber)->exists()) {
                return $lotNumber;
            }
        } while ($attempts < 10);

        throw new \RuntimeException('Unable to generate a unique lot number.');
    }

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

    public function attemptWeight(string $type, int $attemptNumber): ?float
    {
        $attempt = $this->attempts->first(function ($attempt) use ($type, $attemptNumber) {
            return $attempt->type === $type && $attempt->attempt_number === $attemptNumber;
        });

        return $attempt?->weight;
    }
}
