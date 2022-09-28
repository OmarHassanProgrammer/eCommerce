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
        $user->is_trader = ($request->isTrader? 1:0);
        $user->save();

        $user->_token = auth()->tokenById($user->id);

        return $this->returnData("auth", $user);
    }

    public function update(Request $request) {
        $user = User::find(auth()->guard('user-api')->user()->id);

        $user->name = $request->name?$request->name:auth()->guard('user-api')->user()->name;
        $user->email = $request->email?$request->email:auth()->guard('user-api')->user()->email;
        $user->postal_code = $request->postal_code?$request->postal_code:auth()->guard('user-api')->user()->postal_code;


        if($request->isTrader) {
            $user->is_trader = $request->isTrader ==='yes'?true:false;
        }

        if($request->currentPassword) {
            $currentPassword = $request->currentPassword;
            $newPassword = $request->newPassword;

            if(auth()->guard('user-api')->attempt(
                ['email' => $user->email,
                'password' => $currentPassword])) {
                    
                $user->update([
                    'password' => bcrypt($newPassword)
                ]);
            } else {
                return 'currentPasswordNotCorrect';
            }
        }
        $user->save();

        return $user;
    }

    public function getCart() {
        $user = User::find(auth()->guard('user-api')->user()->id);
        $cart = $user->cart;
        
        return $cart;
    }

    public function updateQty(Request $request) {
        $user = User::find(auth()->guard('user-api')->user()->id);
        $cart = $user->cart;

        $cart_array = explode(',', $cart);

        foreach($cart_array as $key => $product) {
            if(explode(':', $product)[0] == $request->product) {
                unset($cart_array[$key]);
                array_push($cart_array, $request->product . ':' . $request->newValue);
            }
        }
        $new_cart = join(',', $cart_array);
        $user->update([
            'cart' => $new_cart
        ]);
        
        $user->save();
        return $user->cart;
    }

    public function addToCart(Request $request) {
        $user = User::find(auth()->guard('user-api')->user()->id);
        $cart = $user->cart;
        $cart_array = explode(',', $cart);
        $cart_array_without_qty = [];

        foreach($cart_array as $product) {
           array_push($cart_array_without_qty, explode(':', $product)[0]);
        }

        if(!array_search($request->product, $cart_array_without_qty)) {
            array_push($cart_array, $request->product . ':' . $request->qty);
            $new_cart = join(',', $cart_array);
            $user->update([
                'cart' => $new_cart
            ]);
        }
        $user->save();
        return $user->cart;
    }

    public function isInCart(Request $request) {
        $cart = User::find(auth()->guard('user-api')->user()->id)->cart;
        $cart_array = explode(',', $cart);  
        $cart_array_without_qty = [];

        foreach($cart_array as $product) {
           array_push($cart_array_without_qty, explode(':', $product)[0]);
        }

        return response()->json([
            'isInCart' =>array_search($request->product, $cart_array_without_qty)?true:false
        ]);
    }

    public function deleteFromCart(Request $request) {
        $user = User::find(auth()->guard('user-api')->user()->id);
        $cart = $user->cart;
        $cart_array = explode(',', $cart);
        $cart_array_without_qty = [];

        foreach($cart_array as $product) {
           array_push($cart_array_without_qty, explode(':', $product)[0]);
        }

        if(array_search($request->product, $cart_array_without_qty)) {
            unset($cart_array[array_search($request->product, $cart_array_without_qty)]);
            $new_cart = join(',', $cart_array);
            $user->update([
                'cart' => $new_cart
            ]);
        }
        $user->save();
        return $user->cart;
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
