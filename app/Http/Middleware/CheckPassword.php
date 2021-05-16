<?php

namespace App\Http\Middleware;

use App\Traits\GeneralTrait;
use Closure;
use Illuminate\Http\Request;

class CheckPassword
{
    use GeneralTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $errorMsg = "The api password in not valid";
        $api_password = $request->route("api_password");

        if(!isset($request->api_password)) {
            return $this->returnError('E002', $errorMsg, $request->_token);
        }
        if($request->api_password != env("API_PASSWORD", "e8tGHfbfIwJ5Yp0XNpK21QIHFAC")) {
            return $this->returnError('E002', $errorMsg);
        }
        return $next($request);
    }
}
