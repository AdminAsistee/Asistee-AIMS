<?php

Route::middleware( [ 'auth:api' ] )->group( function () {
	Route::get( '/cleanings', 'CleaningController@index' );
	Route::get( '/cleanings/{cleaning}', 'CleaningController@show' );
	Route::post( '/cleanings/create', 'CleaningController@store' );
	Route::put( '/cleanings/{cleaning}', 'CleaningController@update' );
} );

Route::middleware( [ 'auth:api', 'permission:admin-supervisor' ] )->group( function () {
	Route::put( 'unassign-cleaner', 'CleaningController@unassignCleaner' );
	Route::put( 'assign-cleaner', 'CleaningController@assignCleaner' );
	Route::get( 'cleaner-users', 'CleaningController@cleanerUsers' );
} );


Route::middleware( [ 'auth:api', 'permission:cleaner' ] )->group( function () {
	Route::put( 'assign-me', 'CleaningController@assignMe' );
} );