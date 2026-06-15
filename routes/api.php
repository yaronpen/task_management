<?php
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('tasks', TaskController::class);

Route::post('tasks/{id}/toggle', [TaskController::class, 'toggle']);