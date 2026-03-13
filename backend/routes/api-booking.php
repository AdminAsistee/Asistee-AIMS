<?php

// Admin only access pages
Route::middleware( [ 'auth:api', 'permission:management' ] )->group( function () {
	Route::get( '/bookings', 'BookingController@index' );
	Route::post( '/bookings', 'BookingController@store' );
	Route::get( '/bookings/{booking}', 'BookingController@show' );
	Route::put( '/bookings/{booking}', 'BookingController@update' );
	Route::delete( '/bookings/{booking}', 'BookingController@delete' );
} );
