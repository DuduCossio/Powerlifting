<?php

namespace App\Http\Controllers\Judge;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function create()
    {
        return inertia('Judge/Index');
    }
}
