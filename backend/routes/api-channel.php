<?php
Route::middleware( [ 'auth:api', 'permission:admin' ] )->group( function () {
	Route::get( '/channel/cleanings', 'ChannelController@pullCleanings' );
	Route::get( '/channel/{listing}', 'ChannelController@index' );
	// Route::post( '/cleanings/create', 'CleaningController@store' );
} );