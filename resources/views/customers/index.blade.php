@extends('layouts.app')

@section('content')

<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Customers</h1>

    <a href="/customers/create"
       class="bg-blue-500 text-white px-4 py-2 rounded">
        Add Customer
    </a>
</div>

<div class="bg-white shadow rounded-lg overflow-hidden">

    <table class="w-full">

        <thead class="bg-gray-200">
            <tr>
                <th class="p-3 text-left">ID</th>
                <th class="p-3 text-left">Name</th>
                <th class="p-3 text-left">Email</th>
                <th class="p-3 text-left">Phone</th>
                <th class="p-3 text-left">Address</th>
                <th class="p-3 text-left">Action</th>
            </tr>
        </thead>

        <tbody>

            @foreach ($customers as $customer)

            <tr class="border-t">
                <td class="p-3">{{ $customer->id }}</td>
                <td class="p-3">{{ $customer->name }}</td>
                <td class="p-3">{{ $customer->email }}</td>
                <td class="p-3">{{ $customer->phone }}</td>
                <td class="p-3">{{ $customer->address }}</td>

                <td class="p-3 flex gap-2">

                    <a href="/customers/{{ $customer->id }}/edit"
                       class="bg-yellow-500 text-white px-3 py-1 rounded">
                        Edit
                    </a>

                    <form action="/customers/{{ $customer->id }}" method="POST">
                        @csrf
                        @method('DELETE')

                        <button class="bg-red-500 text-white px-3 py-1 rounded">
                            Delete
                        </button>
                    </form>

                </td>
            </tr>

            @endforeach

        </tbody>

    </table>

</div>

@endsection