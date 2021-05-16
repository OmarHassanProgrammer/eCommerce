<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;

class AdminController extends Controller
{
    use GeneralTrait;

    public function __construct() {
        $this->middleware('jwt:admin-api', ['except' => ['login', 'register']]);
    }

    public function login(Request $request) {
        try {
            $credentials = $request->only(['email', 'password']);
            $token = auth()->guard('admin-api')->attempt($credentials);

            if(!$token) {
                return $this->returnError('E200', 'invalid email or password');
            }
            $admin = auth()->guard('admin-api')->user();
            $admin->_token = $token;

            return $this->returnData('auth', $admin);
        } catch (\Exception $error) {
            return $error;
            return $this->returnError('E001', 'there is some error');
        }
    }

    public function register(Request $request) {
        $admin = new Admin();
        $admin->name = $request->name;
        $admin->email = $request->email;
        $admin->password = bcrypt($request->password);
        $admin->rank = $request->rank;
        $admin->save();
        $admin->_token = auth('admin-api')->tokenById($admin->id);

        return $this->returnData("auth", $admin);
    }

    public function logout() {
        auth()->guard('admin-api')->logout();
        return $this->returnSuccessMessage("Successfully logged out");
    }

    public function me() {
        return $this->returnData('auth', auth()->guard('admin-api')->user());
    }

    public function refresh() {
        $admin = auth()->guard('admin-api')->user();
        $newToken = auth()->guard('admin-api')->refresh();
        $admin->_token = $newToken;

        return $this->returnData('auth', $admin);
    }
}
