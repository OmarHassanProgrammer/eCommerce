<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['namespace' => 'Auth', 'prefix' => 'auth'], function() {
    Route::group(['prefix' => 'user'], function() {
        Route::get('getUsers', 'UserController@getUsers');
        Route::post('login', 'UserController@login');
        Route::post('register', 'UserController@register');
        Route::post('update', 'UserController@update');
        Route::get('getCart', 'UserController@getCart');
        Route::post('addToCart', 'UserController@addToCart');
        Route::post('deleteFromCart', 'UserController@deleteFromCart');
        Route::post('updateQty', 'UserController@updateQty');
        Route::post('isInCart', 'UserController@isInCart');
        Route::get('me', 'UserController@me');
        Route::get('logout', 'UserController@logout');
        Route::get('refresh', 'UserController@refresh');
    });
    Route::group(['prefix' => 'admin'], function() {
        Route::post('login', 'AdminController@login');
        Route::post('register', 'AdminController@register');
        Route::get('me', 'AdminController@me');
        Route::get('logout', 'AdminController@logout');
        Route::get('refresh', 'AdminController@refresh');
    });
});
Route::group(['prefix' => 'category'], function() {
    Route::get('getAll', 'CategoryController@getCategories');
    Route::get('getTopCategories', 'CategoryController@getTopCategories');
    Route::get('getSubCategories/{id}', 'CategoryController@getSubCategories');
    Route::get('get/{id}', 'CategoryController@getCategory');
    Route::post('add', 'CategoryController@addCategory');
    Route::post('edit', 'CategoryController@update');
    Route::get('delete', 'CategoryController@delete');
});
Route::group(['prefix' => 'product'], function() {
    Route::get('getAll', 'ProductController@getProducts');
    Route::get('get/{id}', 'ProductController@getProduct');
    Route::get('getCategoryProducts/{id}', 'ProductController@getCategoryProducts');
    Route::post('create', 'ProductController@createProduct');
    Route::post('edit', 'ProductController@updateProduct');
    Route::get('delete', 'ProductController@deleteProduct');
});
Route::group(['prefix' => 'brand'], function () {
    Route::get('getAll', 'BrandController@getBrands');
});
