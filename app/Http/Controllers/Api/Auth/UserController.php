<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;

class UserController extends Controller
{
    use GeneralTrait;

    public function __construct() {
        $this->middleware('jwt:user-api', ['except' => ['login', 'register']]);
    }

    public function getUsers(Request $request) {
        switch ($request->type) {
            case "ALL":
                if($request->pagination == 0) {
                return User::all();
                } else {
                    return User::orderBy('created_at', 'desc')->paginate($request->pagination);
                }
            case "USERS":
                if($request->pagination == 0) {
                    return User::where("is_trader", 0)->get();
                } else {
                    return User::where("is_trader", 0)->orderBy('created_at', 'desc')->paginate($request->pagination);
                }
            case "TRADERS":
                if($request->pagination == 0) {
                    return User::where("is_trader", 1)->get();
                } else {
                    return User::where("is_trader", 1)->orderBy('created_at', 'desc')->paginate($request->pagination);
                }
        }
    }

    public function login(Request $request) {
        try {

            $credentials = $request->only(['email', 'password']);
            $token = auth()->guard('user-api')->attempt($credentials);
            
            if(!$token) {
                return $this->returnError('E200', 'invalid email or password');
            }
            $user = auth()->user();
            $user->_token = $token;

            return $this->returnData('auth', $user);
        } catch (\Exception $error) {
            return "sads";
            return $error;
            return $this->returnError('E001', 'there is some error');
        }
    }

    public function register(Request $request) {
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->is_trader = ($request->is_trader? 1:0);
        $user->save();

        $user->_token = auth()->tokenById($user->id);

        return $this->returnData("auth", $user);
    }

    public function logout() {
        auth()->logout();
        return $this->returnSuccessMessage("Successfully logged out");
    }

    public function me() {
        return $this->returnData('auth', auth()->guard('user-api')->user());
    }

    public function refresh() {
        $newToken = auth()->refresh();
        $user = auth()->user();
        $user->_token = $newToken;

        return $this->returnData('auth', $user);
    }
}
