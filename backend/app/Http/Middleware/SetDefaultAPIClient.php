<?php

namespace App\Http\Middleware;

use App\OAuthClients;
use Closure;

class SetDefaultAPIClient {
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  \Closure $next
	 *
	 * @return mixed
	 */
	public function handle( $request, Closure $next ) {

		if ( $this->isRequestingTokenWithoutClientID( $request ) ) {
			$client = $this->grabTheFirstValidPasswordClient();
			if ( $client ) {
				$request->merge( [
					'client_id'     => $client->id,
					'client_secret' => $client->secret,
					'scope'         => '*'
				] );
			} else {
				return response( [ 'message'  => 'No valid password grant client found',
				                   'dev_hint' => 'run command `php artisan passport:install`'
				], 500 );
			}
		}

		return $next( $request );
	}

	/**
	 * @param  \Illuminate\Http\Request $request
	 *
	 * @return bool
	 */
	public function isRequestingTokenWithoutClientID( $request ) {
		return $request->path() == "oauth/token" && $request->get( 'client_id' ) == null;
	}

	/**
	 * @return \App\OAuthClients
	 */
	public function grabTheFirstValidPasswordClient() {
		return OAuthClients::whereRevoked( 0 )->wherePasswordClient( 1 )->first();
	}
}
