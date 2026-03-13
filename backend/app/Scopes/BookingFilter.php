<?php

namespace App\Scopes;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class BookingFilter extends ModelFilter {

	public function custom_before( $param ) {
		if ( isset( $this->request->all()['upcoming'] ) ) {
			$this->query->whereDate( 'checkin', '>=', Carbon::today() );
		}

		$user = \Auth::user();

		if ( $user->type == 'client' ) {
			$this->query->whereHas( 'listing', function ( Builder $query ) use ( $user ) {
				$query->whereHas( 'locations', function ( Builder $query ) use ( $user ) {
					$query->where( 'owner_id', $user->id );
				} );
			} );
		}
	}

	public function location_id( $param ) {
		$this->query->whereHas( 'listing', function ( Builder $query ) use ( $param ) {
			$query->whereHas( 'locations', function ( Builder $query ) use ( $param ) {
				$query->where( 'id', $param );
			} );
		} );
	}

	public function checkin_from( $day_from ) {
		$this->query->whereDate( 'checkin', '>=', $day_from );
	}

	public function thisMonth( $val ) {
		$date = Carbon::parse( $val );
		$this->query->whereYear( 'checkin', $date->year )
		            ->whereMonth( 'checkin', '>=', ( $date->month - 1 ) )
		            ->whereMonth( 'checkin', '<=', ( $date->month + 1 ) );
	}


	public function checkin_to( $day_to ) {
		$this->query->whereDate( 'checkin', '<=', $day_to );
	}

	public function perPage( $val ) {
		$this->itemsPerPage = $val;
	}

}