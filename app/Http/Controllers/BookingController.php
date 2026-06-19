<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
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
            'total_price' => 'required',
            'payment_method' => 'nullable|string'
        ]);

        $data = $request->all();
        
        // If payment method is cash, auto-confirm booking
        if (isset($data['payment_method']) && $data['payment_method'] === 'cash') {
            $data['status'] = 'active';
        } else {
            $data['status'] = 'pending';
        }

        $booking = Booking::create($data);

        // Only update room status if booking is confirmed (active)
        if ($data['status'] === 'active') {
            Room::where('id', $data['room_id'])->update(['status' => 'Booked']);
        }

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

        // If booking is cancelled, make room available again
        if ($request->status === 'cancelled') {
            Room::where('id', $booking->room_id)->update(['status' => 'Available']);
        }

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

    public function updateStatus(Request $request, string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,active,completed,cancelled'
        ]);

        $booking->update(['status' => $request->status]);

        // If admin confirms booking (active), update room status to Booked
        if ($request->status === 'active') {
            Room::where('id', $booking->room_id)->update(['status' => 'Booked']);
        }

        // If booking is cancelled or completed, make room available again
        if ($request->status === 'cancelled' || $request->status === 'completed') {
            Room::where('id', $booking->room_id)->update(['status' => 'Available']);
        }

        return response()->json([
            'message' => 'Status booking berhasil diupdate',
            'data' => $booking
        ]);
    }

    public function checkout(string $id)
    {
        $booking = Booking::with('room')->find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        if ($booking->status !== 'active') {
            return response()->json([
                'message' => 'Hanya booking aktif yang bisa checkout'
            ], 400);
        }

        // Update booking status to completed
        $booking->update(['status' => 'completed']);

        // Make room available again
        if ($booking->room) {
            $booking->room->update(['status' => 'Available']);
        }

        return response()->json([
            'message' => 'Checkout berhasil! Kamar telah tersedia kembali.',
            'data' => $booking
        ]);
    }
}