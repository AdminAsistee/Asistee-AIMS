<?php

namespace App\Providers;

use App\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;
use App\Policies\LocationPolicy;

class AuthServiceProvider extends ServiceProvider {
	/**
	 * The policy mappings for the application.
	 *
	 * @var array
	 */
	protected $policies = [
		// 'App\Model' => 'App\Policies\ModelPolicy',
		// Policy registration here doesn't seem to work.
		// App\Location::class=>App\Policies\LocationPolicy::class,
		// 'App\Location' => 'App\Policies\LocationPolicy',
	];

	/**
	 * Register any authentication / authorization services.
	 *
	 * @return void
	 */
	public function boot() {
		$this->registerPolicies();
		$this->registerLocationPolicies();
		$this->registerListingPolicies();
		$this->registerBookingPolicies();
		$this->registerCleaningPolicies();
		$this->registerChannelAccountPolicies();


		Passport::routes();
		Passport::tokensExpireIn( Carbon::now()->addHour( env( 'TOKEN_EXPIRATION_IN_HOURS', 200 ) ) );
		Passport::refreshTokensExpireIn( Carbon::now()->addHour( env( 'TOKEN_REFRESH_EXPIRATION_IN_HOURS', 200 ) ) );

		// define access for each user type
		foreach ( User::$types as $type ) {
			Gate::define( $type, function ( $user ) use ( $type ) {
				return $user->type === $type;
			} );
		}
		// alias admin for administrator
		Gate::define( 'admin', function ( $user ) {
			return $user->type === 'administrator';
		} );

		Gate::define( 'kankeisha', function ( $user ) {
			return $user->type === 'administrator'
				|| $user->type === 'supervisor'
				|| $user->type === 'cleaner'
				|| $user->type === 'messenger';
		} );

		Gate::define( 'operations', function ( $user ) {
			return $user->type === 'administrator'
				|| $user->type === 'supervisor'
				|| $user->type === 'cleaner'
				|| $user->type === 'client'
				|| $user->type === 'messenger';
		} );

		Gate::define( 'management', function ( $user ) {
			return $user->type === 'administrator'
				|| $user->type === 'supervisor'
				|| $user->type === 'client';
		} );

	}

	public function registerLocationPolicies(){
		Gate::define( 'create_Location', 'App\Policies\LocationPolicy@create');
		Gate::define( 'view_Location', 'App\Policies\LocationPolicy@view');
		Gate::define( 'update_Location', 'App\Policies\LocationPolicy@update');
		Gate::define( 'delete_Location', 'App\Policies\LocationPolicy@delete');
	}

	public function registerListingPolicies(){
		Gate::define( 'create_Listing', 'App\Policies\ListingPolicy@create');
		Gate::define( 'view_Listing', 'App\Policies\ListingPolicy@view');
		Gate::define( 'update_Listing', 'App\Policies\ListingPolicy@update');
		Gate::define( 'delete_Listing', 'App\Policies\ListingPolicy@delete');
	}

	public function registerBookingPolicies(){
		Gate::define( 'create_Booking', 'App\Policies\BookingPolicy@create');
		Gate::define( 'view_Booking', 'App\Policies\BookingPolicy@view');
		Gate::define( 'update_Booking', 'App\Policies\BookingPolicy@update');
		Gate::define( 'delete_Booking', 'App\Policies\BookingPolicy@delete');
	}

	public function registerCleaningPolicies(){
		Gate::define( 'create_Cleaning', 'App\Policies\CleaningPolicy@create');
		Gate::define( 'view_Cleaning', 'App\Policies\CleaningPolicy@view');
		Gate::define( 'update_Cleaning', 'App\Policies\CleaningPolicy@update');
		Gate::define( 'delete_Cleaning', 'App\Policies\CleaningPolicy@delete');
	}

	public function registerChannelAccountPolicies(){
		Gate::define( 'create_ChannelAccount', 'App\Policies\ChannelAccountPolicy@create');
		Gate::define( 'view_ChannelAccount', 'App\Policies\ChannelAccountPolicy@view');
		Gate::define( 'update_ChannelAccount', 'App\Policies\ChannelAccountPolicy@update');
		Gate::define( 'delete_ChannelAccount', 'App\Policies\ChannelAccountPolicy@delete');
	}
}
