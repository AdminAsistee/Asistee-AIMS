<?php

namespace App\Scopes;

use App\Cleaning;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CleaningFilter extends ModelFilter {

	public function custom_before( $param ) {
		if ( Gate::allows( 'cleaner', Cleaning::class )
		     && ! isset( $this->request->all()['unassigned'] ) ) {
			$this->query->where( 'cleaner_id', Auth::user()->id );
		} elseif ( Gate::allows( 'client', Cleaning::class ) ) {
			// Client
			$this->query->wherein( 'location_id', Auth::user()->locations->map( function ( $location ) {
				return $location->id;
			} ) );
		}
	}

	public function cleaning_date( $cleaning_date ) {
		if ( is_array( $cleaning_date ) ) {
			$this->query->whereIn( 'cleaning_date', $cleaning_date );
		} else if ( $cleaning_date ) {
			$this->query->where( 'cleaning_date', $cleaning_date );
		}
	}

	public function thisMonth( $val ) {
		$date = Carbon::parse( $val );
		$this->query->whereYear( 'cleaning_date', $date->year )->whereMonth( 'cleaning_date', $date->month );
	}

	public function day_from( $day_from ) {
		$this->query->whereDate( 'cleaning_date', '>=', $day_from );
	}


	public function day_to( $day_to ) {
		$this->query->whereDate( 'cleaning_date', '<=', $day_to );
	}

	public function location_id( $location_id ) {
		if ( is_array( $location_id ) ) {
			$this->query->whereIn( 'location_id', $location_id );
		} else if ( $location_id ) {
			$this->query->where( 'location_id', $location_id );
		}
	}

	public function cleaner_id( $cleaner_id ) {
		if ( is_array( $cleaner_id ) ) {
			$this->query->whereIn( 'cleaner_id', $cleaner_id );
		} else if ( $cleaner_id ) {
			$this->query->where( 'cleaner_id', $cleaner_id );
		}
	}

	public function unassigned( $unassigned ) {
		$this->query->where( 'cleaner_id', null );
	}

	public function perPage( $val ) {
		$this->itemsPerPage = $val;
	}

}