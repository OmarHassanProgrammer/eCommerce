<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Product extends Model
{
    use Notifiable;

    protected $fillable = [
        'name', 'trader', 'category', 'price', 'quantity', 'description', 'created_at', 'updated_at'
    ];
    protected $hidden = [
        'created_at', 'updated_at'
    ];
    protected $casts = [
    ];
}
