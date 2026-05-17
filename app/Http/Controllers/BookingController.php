<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(
            Booking::with(['customer', 'room'])->get()
        );
    }

    public function store(Request $request)
    {
        $booking = Booking::create($request->all());

        return response()->json([
            'message' => 'Booking berhasil ditambahkan',
            'data' => $booking
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(
            Booking::with(['customer', 'room'])->findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update($request->all());

        return response()->json([
            'message' => 'Booking berhasil diupdate',
            'data' => $booking
        ]);
    }

    public function destroy(string $id)
    {
        Booking::destroy($id);

        return response()->json([
            'message' => 'Booking berhasil dihapus'
        ]);
    }
}