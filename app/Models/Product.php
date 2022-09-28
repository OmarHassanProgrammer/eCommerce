<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Product extends Model
{
    use Notifiable;

    protected $fillable = [
        'name', 'trader', 'category', 'brand_id', 'price', 'quantity', 'description', 'logo', 'created_at', 'updated_at'
    ];
    protected $hidden = [
        'created_at', 'updated_at'
    ];
    protected $casts = [
    ];

    public function brand()
    {
        return Brand::find($this->brand_id);;
    }
    public function trader()
    {
        return User::find($this->trader);
    }
    public function category()
    {
        return Category::find($this->category);
    }
    public function rates() {
        return $this->hasMany(Rate::class);
    }
}
