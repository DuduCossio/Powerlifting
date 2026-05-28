<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Auth/Login')->name('login');
Route::inertia('/juez', 'Judge/Index')->name('judge.index');
Route::inertia('/mesa', 'Desk/Index')->name('desk.index');
Route::inertia('/admin', 'Admin/Index')->name('admin.index');
