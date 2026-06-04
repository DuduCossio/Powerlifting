<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Desk\CompetitorController;

Route::inertia('/', 'Auth/Login')->name('login');

/*Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::resource('user', UserController::class)->name('dashboard');

});*/

Route::middleware(['auth', 'mesa'])
    ->prefix('desk')
    ->name('desk.')
    ->group(function () {

        Route::resource('competitors', CompetitorController::class)
            ->only('create' ,'store');

});

/*Route::inertia('/juez', 'Judge/Index')->name('judge.index');
Route::inertia('/mesa', 'Desk/Index')->name('desk.index');
Route::inertia('/admin', 'Admin/Index')->name('admin.index');*/
