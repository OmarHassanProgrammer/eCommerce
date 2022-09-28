<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;

class brandController extends Controller
{
    public function getBrands() {
        return Brand::all();
    }
}
