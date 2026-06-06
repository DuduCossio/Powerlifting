<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Desk\CompetitorController;
use App\Http\Controllers\Judge\VoteController;
use App\Http\Controllers\Admin\DashboardController;

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

});

Route::middleware(['auth', 'mesa'])
    ->prefix('desk')
    ->name('desk.')
    ->group(function () {

        Route::resource('competitors', CompetitorController::class)
            ->only('create' ,'store');

});

Route::middleware(['auth', 'juez'])
    ->prefix('judge')
    ->name('judge.')
    ->group(function () {

        Route::resource('votes', VoteController::class)
            ->only('create' ,'store');

});

/*Route::inertia('/juez', 'Judge/Index')->name('judge.index');
Route::inertia('/mesa', 'Desk/Index')->name('desk.index');
Route::inertia('/admin', 'Admin/Index')->name('admin.index');*/
