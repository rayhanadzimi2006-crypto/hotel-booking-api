@extends('layouts.app')

@section('content')

<h1 class="text-3xl font-bold mb-6">Rooms</h1>

<div class="bg-white shadow rounded-lg overflow-hidden">

<table class="w-full">

    <thead class="bg-gray-200">
        <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Room Number</th>
            <th class="p-3 text-left">Room Type ID</th>
            <th class="p-3 text-left">Status</th>
        </tr>
    </thead>

    <tbody>

        @foreach ($rooms as $room)

        <tr class="border-t">
            <td class="p-3">{{ $room->id }}</td>
            <td class="p-3">{{ $room->room_number }}</td>
            <td class="p-3">{{ $room->room_type_id }}</td>
            <td class="p-3">{{ $room->status }}</td>
        </tr>

        @endforeach

    </tbody>

</table>

</div>

@endsection