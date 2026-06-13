<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CompetitionQueue;

class DashboardController extends Controller
{
    public function index(CompetitionQueue $competitionQueue)
    {
        $latestSessionGroups = $competitionQueue->groupsForLatestSession();

        return inertia('Admin/Index', [
            'latestSessionGroups' => $latestSessionGroups,
        ]);
    }
}
