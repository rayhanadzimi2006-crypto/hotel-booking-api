<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RoomType;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'room_type_id',
        'status'
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
}