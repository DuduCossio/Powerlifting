<?php

namespace App\Http\Controllers\Desk;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCompetitorRequest;
use App\Models\Competitor;
use App\Models\Category;
use App\Models\Division;
use App\Models\Group;
use Illuminate\Support\Facades\DB;

class CompetitorController extends Controller
{
    public function create()
    {
        $categories = Category::all();
        $divisions = Division::all();
        $groups = Group::with('championshipSession')->get();

        return inertia('Desk/Index', [
            'categories' => $categories,
            'divisions' => $divisions,
            'groups' => $groups,
        ]);
    }

    public function store(StoreCompetitorRequest $request) 
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $competitor = Competitor::create($validated);

            if (isset($validated['attempts'])) {
                foreach ($validated['attempts'] as $attemptData) {
                    $competitor->attempts()->create($attemptData);
                }
            }
        });

        return redirect()
            ->route('desk.competitors.create')
            ->with('success', 'Competidor registrado exitosamente.');
    }
}
