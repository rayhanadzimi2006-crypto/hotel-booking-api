<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('app');
});

Route::resource('customers', CustomerController::class);
Route::resource('room-types', RoomTypeController::class);
Route::resource('rooms', RoomController::class);
Route::resource('bookings', BookingController::class);
Route::resource('payments', PaymentController::class);