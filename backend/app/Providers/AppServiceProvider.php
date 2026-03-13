<?php

// TODO: Make validation tag that ensures object field type. 
// Example: Cleaning SET CLEANER should validate 
// Cleaner_id -> User[Type] == Cleaner (and not client, etc.)
// For now leaving as possibility.

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;

class AppServiceProvider extends ServiceProvider {
	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot() {
		\Schema::defaultStringLength( 191 );
		Cashier::useCurrency( 'JPY', '￥' );
	}

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register() {
		//
	}
}
