<?php

use Illuminate\Http\Request;

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

$api = app('Dingo\Api\Routing\Router');

$api->version('v1', ['namespace' => 'App\Http\Controllers'], function ($api) {

    ## Login
    $api->post('/login', 'AuthController@login');
    $api->post('/signup', 'AuthController@signup');
    $api->get('/logout', 'AuthController@logout');

    $api->group(['middleware' => ['jwt.auth'], 'namespace' => '\Api'], function($api) {    
        $api->resource('/users', 'UserController');
        $api->resource('/tasks', 'TaskController');
        $api->post('/tasks/upload/{id}', 'TaskController@fileUpload');
        $api->post('/tasks/search', 'TaskController@searchTask');
    });
});
