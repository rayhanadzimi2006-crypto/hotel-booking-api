<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Room;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function statistics()
    {
        $totalCustomers = Customer::count();
        $totalRooms = Room::count();
        $totalBookings = Booking::count();
        $totalPayments = Payment::sum('amount');

        return response()->json([
            'total_customers' => $totalCustomers,
            'total_rooms' => $totalRooms,
            'total_bookings' => $totalBookings,
            'total_payments' => $totalPayments
        ]);
    }

    public function monthlyStatistics()
{
    $month = Carbon::now()->month;
    $year = Carbon::now()->year;

    $totalTransactionsMonth = Booking::whereMonth('check_in', $month)
        ->whereYear('check_in', $year)
        ->count();

    $totalIncomeMonth = Payment::whereMonth('payment_date', $month)
        ->whereYear('payment_date', $year)
        ->sum('amount');

    return response()->json([
        'month' => $month,
        'year' => $year,
        'total_transactions' => $totalTransactionsMonth,
        'total_income' => $totalIncomeMonth
    ]);
}

    public function yearlyStatistics()
{
    $year = Carbon::now()->year;

    $totalTransactionsYear = Booking::whereYear('check_in', $year)
        ->count();

    $totalIncomeYear = Payment::whereYear('payment_date', $year)
        ->sum('amount');

    return response()->json([
        'year' => $year,
        'total_transactions' => $totalTransactionsYear,
        'total_income' => $totalIncomeYear
    ]);
}
}