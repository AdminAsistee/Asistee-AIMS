<?php

namespace App\Scopes;


class SuppliesTransactionFilter extends ModelFilter {

	public function custom_before( $param ) {

	}

	public function cleaning_id( $cleaning_id ) {
		$this->query->where( 'cleaning_id',$cleaning_id);
	}

	public function status( $status ) {
		$this->query->where( 'status',$status);
	}

	public function location_id( $location_id ) {
		$this->query->where( 'cleaning.location_id',$location_id);
	}

	// public function price( $price ) {
	// 	$this->query->where( 'price.amount', 'like', '%' . $price . '%' );
	// }

	// public function owner( $owner ) {
	// 	$this->query->whereHas( 'owner', function ( $query ) use ( $owner ) {
	// 		$query->where( 'name', 'like', '%' . $owner . '%' )->orWhere( 'email', 'like', '%' . $owner . '%' );
	// 	}
	// 	);
	// }
}