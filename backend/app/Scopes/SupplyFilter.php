<?php

namespace App\Scopes;


class SupplyFilter extends ModelFilter {

	public function custom_before( $param ) {

	}

	public function name( $name ) {
		$this->query->where( 'name', 'like', '%' . $name . '%' );
	}

	// public function price( $price ) {
	// 	$this->query->where( 'price.amount', 'like', '%' . $price . '%' );
	// }

	public function out( ) {
		$this->query->where( 'ready_stock', 0);
	}

	// public function owner( $owner ) {
	// 	$this->query->whereHas( 'owner', function ( $query ) use ( $owner ) {
	// 		$query->where( 'name', 'like', '%' . $owner . '%' )->orWhere( 'email', 'like', '%' . $owner . '%' );
	// 	}
	// 	);
	// }
}