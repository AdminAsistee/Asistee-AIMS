<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;

class ListingFilter extends ModelFilter {

	public function custom_before( $param ) {
		$user = \Auth::user();
		if ( $user->type == 'client' ) {
			$this->query->whereHas( 'locations', function ( Builder $query ) use ( $user ) {
				$query->where( 'owner_id', $user->id );
			} );
		}
	}

	public function perPage( $val ) {
		$this->itemsPerPage = $val;
	}

}