<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;

Route::apiResource('customers', CustomerController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('payments', PaymentController::class);
Route::get('statistics', [DashboardController::class, 'statistics']);
Route::get('statistics/monthly', [DashboardController::class, 'monthlyStatistics']);
Route::get('statistics/yearly', [DashboardController::class, 'yearlyStatistics']);