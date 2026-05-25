<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return response()->json(Customer::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required'
        ]);

        $customer = Customer::create($request->all());

        return response()->json([
            'message' => 'Customer berhasil ditambahkan',
            'data' => $customer
        ], 201);
    }

    public function show(string $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer tidak ditemukan'
            ], 404);
        }

        return response()->json($customer);
    }

    public function update(Request $request, string $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required'
        ]);

        $customer->update($request->all());

        return response()->json([
            'message' => 'Customer berhasil diupdate',
            'data' => $customer
        ]);
    }

    public function destroy(string $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer tidak ditemukan'
            ], 404);
        }

        try {

            $customer->delete();

            return response()->json([
                'message' => 'Customer berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Customer masih digunakan pada tabel bookings',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}