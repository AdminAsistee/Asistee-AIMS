<?php

namespace App\Http\Middleware;

use Closure;
use Gate;

class AccessBasic {
	/**
	 * Check if the current user is of certain user type. Similar to 'can' middleware.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  \Closure $next
	 * @param   string $userType
	 *
	 * @return mixed
	 */
	public function handle( $request, Closure $next, $userType ) {
		if ( strpos( $userType, '-' ) ) {
			$userType = explode( '-', $userType );
		}
		if ( is_array( $userType ) ) {
			$block = true;
			foreach ( $userType as $singleType ) {
				if ( Gate::allows( $singleType ) ) {
					$block = false;
				}
			}
			if ( $block ) {
				return response( [ 'message' => 'Unauthorized. This is allowed for ' . implode( ', ', $userType ) . ' only.' ], 401 );
			}
		} else if ( Gate::denies( $userType ) ) {
			return response( [ 'message' => 'Unauthorized. This is allowed for ' . $userType . ' only.' ], 401 );
		}

		return $next( $request );
	}
}
