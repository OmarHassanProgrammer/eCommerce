<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    protected $fillable = [
        'user', 'product', 'rate', 'created_at', 'updated_at'
    ];
    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
