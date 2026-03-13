<?php
Route::get( '/test', 'ApiDocController@test' );
Route::get( '/mail-test', 'ApiDocController@mailTest' );

Route::middleware( 'auth:api' )->group( function () {

	Route::get( '/private', function () {
		return response( [ 'message' => 'Private area for any authenticated user' ] );
	} );

} );

// Admin only access pages
Route::middleware( [ 'auth:api', 'permission:admin' ] )->group( function () {

	Route::get( '/admin', function () {
		return response( [ 'message' => 'private area for admin only' ] );
	} );

} );


// Client only access pages
Route::middleware( [ 'auth:api', 'permission:client' ] )->group( function () {

	Route::get( '/client', function () {
		return response( [ 'message' => 'Private area for client only' ] );
	} );

} );

// client or admin can access this because of the 'client-admin' permission
Route::middleware( [ 'auth:api', 'permission:client-admin' ] )->group( function () {

	Route::get( '/client-admin', function () {
		return response( [ 'message' => 'Private area for client or admin' ] );
	} );

} );