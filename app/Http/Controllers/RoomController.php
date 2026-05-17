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
        $room = Room::create($request->all());

        return response()->json([
            'message' => 'Room berhasil ditambahkan',
            'data' => $room
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(
            Room::with('roomType')->findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        $room = Room::findOrFail($id);

        $room->update($request->all());

        return response()->json([
            'message' => 'Room berhasil diupdate',
            'data' => $room
        ]);
    }

    public function destroy(string $id)
    {
        Room::destroy($id);

        return response()->json([
            'message' => 'Room berhasil dihapus'
        ]);
    }
}