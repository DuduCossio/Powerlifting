<?php

namespace App\Http\Controllers\Desk;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompetitorRequest;
use App\Models\Category;
use App\Models\Competitor;
use App\Models\Division;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompetitorController extends Controller
{
    public function index(Request $request)
    {
        $query = Competitor::with([
            'category:id,name',
            'division:id,name',
            'group:id,name',
            'attempts',
        ])
            ->select('id', 'name', 'last_name', 'sexo', 'body_weight', 'category_id', 'lot_number', 'division_id', 'group_id')
            ->orderBy('last_name')
            ->orderBy('name');

        if ($request->filled('search')) {
            $searchTerm = Str::lower($request->input('search'));
            $query->where(function ($q) use ($searchTerm) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(last_name) LIKE ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(CONCAT(name, " ", last_name)) LIKE ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(CONCAT(last_name, " ", name)) LIKE ?', ["%{$searchTerm}%"]);
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('division_id')) {
            $query->where('division_id', $request->input('division_id'));
        }

        if ($request->filled('group_id')) {
            $query->where('group_id', $request->input('group_id'));
        }

        $competitors = $query->get();
        $divisions = Division::all();
        $categories = Category::all();
        $groups = Group::with('championshipSession')->get();

        return Inertia('Desk/Roster', [
            'competitors' => $competitors,
            'divisions' => $divisions,
            'categories' => $categories,
            'groups' => $groups,
            'filters' => $request->only(['search', 'category_id', 'division_id', 'group_id']),
        ]);

    }

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
            ->route('desk.roster')
            ->with('success', 'Competidor registrado exitosamente.');
    }
}
