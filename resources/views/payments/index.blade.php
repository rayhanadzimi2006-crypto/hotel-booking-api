@extends('layouts.app')

@section('content')

<h1 class="text-3xl font-bold mb-6">Payments</h1>

<div class="bg-white shadow rounded-lg overflow-hidden">

<table class="w-full">

    <thead class="bg-gray-200">
        <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Booking ID</th>
            <th class="p-3 text-left">Payment Date</th>
            <th class="p-3 text-left">Amount</th>
            <th class="p-3 text-left">Payment Method</th>
        </tr>
    </thead>

    <tbody>

        @foreach ($payments as $payment)

        <tr class="border-t">
            <td class="p-3">{{ $payment->id }}</td>
            <td class="p-3">{{ $payment->booking_id }}</td>
            <td class="p-3">{{ $payment->payment_date }}</td>
            <td class="p-3">Rp {{ number_format($payment->amount) }}</td>
            <td class="p-3">{{ $payment->payment_method }}</td>
        </tr>

        @endforeach

    </tbody>

</table>

</div>

@endsection