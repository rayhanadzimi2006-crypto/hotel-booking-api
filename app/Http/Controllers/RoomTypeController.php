<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    public function index()
    {
        return response()->json(RoomType::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'type_name' => 'required',
            'price' => 'required',
            'capacity' => 'required'
        ]);

        $roomType = RoomType::create($request->all());

        return response()->json([
            'message' => 'Room type berhasil ditambahkan',
            'data' => $roomType
        ], 201);
    }

    public function show(string $id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'message' => 'Room type tidak ditemukan'
            ], 404);
        }

        return response()->json($roomType);
    }

    public function update(Request $request, string $id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'message' => 'Room type tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'type_name' => 'required',
            'price' => 'required',
            'capacity' => 'required'
        ]);

        $roomType->update($request->all());

        return response()->json([
            'message' => 'Room type berhasil diupdate',
            'data' => $roomType
        ]);
    }

    public function destroy(string $id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'message' => 'Room type tidak ditemukan'
            ], 404);
        }

        try {

            $roomType->delete();

            return response()->json([
                'message' => 'Room type berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Room type masih digunakan pada tabel rooms',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}