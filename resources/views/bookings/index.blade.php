@extends('layouts.app')

@section('content')

<h1 class="text-3xl font-bold mb-6">Bookings</h1>

<div class="bg-white shadow rounded-lg overflow-hidden">

<table class="w-full">

    <thead class="bg-gray-200">
        <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Customer ID</th>
            <th class="p-3 text-left">Room ID</th>
            <th class="p-3 text-left">Check In</th>
            <th class="p-3 text-left">Check Out</th>
            <th class="p-3 text-left">Total Price</th>
        </tr>
    </thead>

    <tbody>

        @foreach ($bookings as $booking)

        <tr class="border-t">
            <td class="p-3">{{ $booking->id }}</td>
            <td class="p-3">{{ $booking->customer_id }}</td>
            <td class="p-3">{{ $booking->room_id }}</td>
            <td class="p-3">{{ $booking->check_in }}</td>
            <td class="p-3">{{ $booking->check_out }}</td>
            <td class="p-3">Rp {{ number_format($booking->total_price) }}</td>
        </tr>

        @endforeach

    </tbody>

</table>

</div>

@endsection