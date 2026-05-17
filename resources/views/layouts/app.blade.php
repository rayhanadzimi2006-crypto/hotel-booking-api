<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Booking</title>

    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100">

<div class="flex min-h-screen">

    <!-- SIDEBAR -->
    <div class="w-64 bg-gray-900 text-white p-5">

        <h1 class="text-2xl font-bold mb-6">Hotel App</h1>

        <nav class="flex flex-col gap-3">

            <a href="/customers" class="hover:bg-gray-700 p-2 rounded">Customers</a>
            <a href="/room-types" class="hover:bg-gray-700 p-2 rounded">Room Types</a>
            <a href="/rooms" class="hover:bg-gray-700 p-2 rounded">Rooms</a>
            <a href="/bookings" class="hover:bg-gray-700 p-2 rounded">Bookings</a>
            <a href="/payments" class="hover:bg-gray-700 p-2 rounded">Payments</a>

        </nav>

    </div>

    <!-- CONTENT -->
    <div class="flex-1 p-6">

        @yield('content')

    </div>

</div>

</body>
</html>