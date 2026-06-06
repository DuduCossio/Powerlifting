<?php

namespace App\Http\Controllers\Desk;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CompetitorController extends Controller
{
    public function create()
    {
        return inertia('Desk/Index');
    }
}
