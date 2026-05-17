<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use App\Models\Room;

class Booking extends Model
{
    protected $fillable = [
    'customer_id',
    'room_id',
    'check_in',
    'check_out',
    'total_price',
    'status'
];

public function customer()
{
    return $this->belongsTo(Customer::class);
}

public function room()
{
    return $this->belongsTo(Room::class);
}
}
