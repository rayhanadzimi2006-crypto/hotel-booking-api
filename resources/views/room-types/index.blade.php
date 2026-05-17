@extends('layouts.app')

@section('content')

<h1 class="text-3xl font-bold mb-6">Room Types</h1>

<div class="bg-white shadow rounded-lg overflow-hidden">

<table class="w-full">

    <thead class="bg-gray-200">
        <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Type Name</th>
            <th class="p-3 text-left">Price</th>
            <th class="p-3 text-left">Capacity</th>
        </tr>
    </thead>

    <tbody>

        @foreach ($roomTypes as $roomType)

        <tr class="border-t">
            <td class="p-3">{{ $roomType->id }}</td>
            <td class="p-3">{{ $roomType->type_name }}</td>
            <td class="p-3">Rp {{ number_format($roomType->price) }}</td>
            <td class="p-3">{{ $roomType->capacity }}</td>
        </tr>

        @endforeach

    </tbody>

</table>

</div>

@endsection