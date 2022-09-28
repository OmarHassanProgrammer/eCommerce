<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'is_trader', 'number', 'cart', 'postal_code', 'number_verified_at', 'email_verified_at', 'created_at', 'updated_at'
    ];
    protected $hidden = [
        'password', 'created_at', 'updated_at'
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'number_verified_at' => 'datetime'
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
