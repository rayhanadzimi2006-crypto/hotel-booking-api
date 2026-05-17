<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with('booking')->get()
        );
    }

    public function store(Request $request)
    {
        $payment = Payment::create($request->all());

        return response()->json([
            'message' => 'Payment berhasil ditambahkan',
            'data' => $payment
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(
            Payment::with('booking')->findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        $payment->update($request->all());

        return response()->json([
            'message' => 'Payment berhasil diupdate',
            'data' => $payment
        ]);
    }

    public function destroy(string $id)
    {
        Payment::destroy($id);

        return response()->json([
            'message' => 'Payment berhasil dihapus'
        ]);
    }
}