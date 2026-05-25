<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(
            Room::with('roomType')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_number' => 'required',
            'room_type_id' => 'required',
            'status' => 'required'
        ]);

        $room = Room::create($request->all());

        return response()->json([
            'message' => 'Room berhasil ditambahkan',
            'data' => $room
        ], 201);
    }

    public function show(string $id)
    {
        $room = Room::with('roomType')->find($id);

        if (!$room) {
            return response()->json([
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        return response()->json($room);
    }

    public function update(Request $request, string $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'room_number' => 'required',
            'room_type_id' => 'required',
            'status' => 'required'
        ]);

        $room->update($request->all());

        return response()->json([
            'message' => 'Room berhasil diupdate',
            'data' => $room
        ]);
    }

    public function destroy(string $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        try {

            $room->delete();

            return response()->json([
                'message' => 'Room berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Room masih digunakan pada tabel bookings',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}