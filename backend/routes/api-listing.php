<?php
Route::middleware( [ 'auth:api' ] )->group( function () {
	Route::get( '/listings', 'ListingController@index' );
	Route::get( '/listings/{listing}', 'ListingController@show' );
	Route::post( '/listings/create', 'ListingController@register' );
	Route::post( '/listings/addLocation', 'ListingController@addLocation' );
} );