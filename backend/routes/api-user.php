<?php

Route::post( '/users', 'UserController@register' );
Route::post( '/request-password-reset', 'UserController@requestPasswordReset' );
Route::post( '/reset-password', 'UserController@performPasswordReset' );

// Admin only access pages
Route::middleware( [ 'auth:api', 'permission:admin' ] )->group( function () {

	Route::get( '/users', 'UserController@index' );
	Route::get( '/users/{user}', 'UserController@show' );
	Route::put( '/users/{user}', 'UserController@update' );
	Route::delete( '/users/{user}', 'UserController@delete' );

} );

Route::middleware( [ 'auth:api' ] )->group( function () {

	Route::get( '/me', 'UserController@me' );
	Route::get( '/logout', 'UserController@logout' );
	Route::post( '/save-card', 'UserController@saveCard' );

} );