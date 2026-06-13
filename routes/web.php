<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\QueueController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Desk\CompetitorController;
use App\Http\Controllers\Judge\VoteController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')
    ->group(function () {

        Route::inertia('/login', 'Auth/Login')
            ->name('login');

        Route::post('/login', [AuthenticatedSessionController::class, 'login'])
            ->name('login.post');

    });

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::resource('dashboard', DashboardController::class)
            ->only('index');

        Route::post('queue/next', [QueueController::class, 'next'])
            ->name('queue.next');
        Route::post('queue/time-out', [QueueController::class, 'timeOut'])
            ->name('queue.time-out');
        Route::get('queue/state', [QueueController::class, 'state'])
            ->name('queue.state');
        Route::get('attempt/{attemptId}/votes', [QueueController::class, 'getVotes'])
            ->name('attempt.votes');
    });

Route::middleware(['auth', 'mesa'])
    ->prefix('desk')
    ->name('desk.')
    ->group(function () {

        Route::resource('competitors', CompetitorController::class)
            ->only('create', 'store');

        Route::get('roster', [CompetitorController::class, 'index'])
            ->name('roster');

    });

Route::middleware(['auth', 'juez'])
    ->prefix('judge')
    ->name('judge.')
    ->group(function () {

        Route::resource('votes', VoteController::class)
            ->only('create', 'store');

        Route::get('queue/state', [QueueController::class, 'state'])
            ->name('queue.state');

    });

/*Route::inertia('/juez', 'Judge/Index')->name('judge.index');
Route::inertia('/mesa', 'Desk/Index')->name('desk.index');
Route::inertia('/admin', 'Admin/Index')->name('admin.index');*/
