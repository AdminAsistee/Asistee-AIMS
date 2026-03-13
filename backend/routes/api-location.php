<?php
Route::middleware( [ 'auth:api' ] )->group( function () {
	Route::get('/locations/open','LocationController@getOpenProperties');
	Route::get( '/locations', 'LocationController@index' );
	Route::get( '/locations/{location}', 'LocationController@show' );
	Route::get( '/locations/{location}/bookings', 'LocationController@viewBookings' );
	Route::get( '/locations/{location}/listings', 'LocationController@viewListings' );
	Route::post( '/locations/create', 'LocationController@create' );
	Route::post( '/locations/addListing', 'LocationController@addListing' );
	Route::post( '/locations-photo/{location}', 'LocationController@uploadPhoto' );
	Route::delete( '/locations-photo/{photo}', 'PropertyPhotoController@delete' );

} );
