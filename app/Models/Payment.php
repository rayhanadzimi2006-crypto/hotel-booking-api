<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;

class Payment extends Model
{
    protected $fillable = [
    'booking_id',
    'payment_date',
    'amount',
    'payment_method'
];

public function booking()
{
    return $this->belongsTo(Booking::class);
}
}
