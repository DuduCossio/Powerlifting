<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CompetitionQueue;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(CompetitionQueue $competitionQueue)
    {
        $latestSessionGroups = $competitionQueue->groupsForLatestSession(Auth::user()->panel_id);

        return inertia('Admin/Index', [
            'latestSessionGroups' => $latestSessionGroups,
            'panelId' => Auth::user()->panel_id,
        ]);
    }
}
