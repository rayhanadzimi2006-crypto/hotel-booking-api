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
        $request->validate([
            'booking_id' => 'required',
            'payment_date' => 'required',
            'amount' => 'required',
            'payment_method' => 'required'
        ]);

        $payment = Payment::create($request->all());

        return response()->json([
            'message' => 'Payment berhasil ditambahkan',
            'data' => $payment
        ], 201);
    }

    public function show(string $id)
    {
        $payment = Payment::with('booking')->find($id);

        if (!$payment) {
            return response()->json([
                'message' => 'Payment tidak ditemukan'
            ], 404);
        }

        return response()->json($payment);
    }

    public function update(Request $request, string $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'message' => 'Payment tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'booking_id' => 'required',
            'payment_date' => 'required',
            'amount' => 'required',
            'payment_method' => 'required'
        ]);

        $payment->update($request->all());

        return response()->json([
            'message' => 'Payment berhasil diupdate',
            'data' => $payment
        ]);
    }

    public function destroy(string $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'message' => 'Payment tidak ditemukan'
            ], 404);
        }

        try {

            $payment->delete();

            return response()->json([
                'message' => 'Payment berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Payment gagal dihapus',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}