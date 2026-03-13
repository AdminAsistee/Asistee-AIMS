<?php

// NOTE : Linked in app/Providers/RouteServiceProvider.php
Route::middleware( [ 'auth:api', 'permission:admin' ] )->group( function () {
	Route::post( '/prices/create', 'PriceController@create' );
	Route::get( '/prices/{price}', 'PriceController@show' );
} );