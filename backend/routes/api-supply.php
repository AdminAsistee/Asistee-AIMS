<?php
Route::middleware( [ 'auth:api' ] )->group( function () {
	// Supplies
	Route::post( '/supplies', 'SupplyController@store' );
	Route::put( '/supplies/{supply}', 'SupplyController@update' );
	Route::get( '/supplies', 'SupplyController@index' );
	Route::get( '/supplies/{supply}', 'SupplyController@show' );

	//convenience route - Add ready_stock by request[amount]
	Route::put( '/supplies/{supply}/buy', 'SupplyController@buy' );
	//convenience route - subtract ready_stock by request[amount],
	// Add in_use_stock by request[amount]
	Route::put( '/supplies/{supply}/use', 'SupplyController@use' );



	// Supplies_Transactions
	Route::post( '/supplies_transactions', 'SuppliesTransactionController@store' );
	Route::put( '/supplies_transactions/{supply_transaction}', 'SuppliesTransactionController@update' );
	Route::get( '/supplies_transactions', 'SuppliesTransactionController@index' );
	Route::get( '/supplies_transactions/{supply_transaction}', 'SuppliesTransactionController@show' );

	//convenience route - change status (from Not Fulfilled) to Staged
	Route::put( '/supplies_transactions/{supply_transaction}/fulfill', 'SuppliesTransactionController@fulfill' );
	//convenience route - change status (from Staged) to Delivered
	Route::put( '/supplies_transactions/{supply_transaction}/deliver', 'SuppliesTransactionController@deliver' );
} );