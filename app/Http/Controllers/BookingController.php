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
        $request->validate([
            'customer_id' => 'required',
            'room_id' => 'required',
            'check_in' => 'required',
            'check_out' => 'required',
            'total_price' => 'required'
        ]);

        $booking = Booking::create($request->all());

        return response()->json([
            'message' => 'Booking berhasil ditambahkan',
            'data' => $booking
        ], 201);
    }

    public function show(string $id)
    {
        $booking = Booking::with(['customer', 'room'])->find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        return response()->json($booking);
    }

    public function update(Request $request, string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'customer_id' => 'required',
            'room_id' => 'required',
            'check_in' => 'required',
            'check_out' => 'required',
            'total_price' => 'required'
        ]);

        $booking->update($request->all());

        return response()->json([
            'message' => 'Booking berhasil diupdate',
            'data' => $booking
        ]);
    }

    public function destroy(string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        try {

            $booking->delete();

            return response()->json([
                'message' => 'Booking berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Booking masih digunakan pada tabel payments',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}