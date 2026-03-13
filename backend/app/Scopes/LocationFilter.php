<?php

namespace App\Scopes;


class LocationFilter extends ModelFilter {

	public function custom_before( $param ) {

	}

	public function address( $address ) {
		$this->query->where( 'address', 'like', '%' . $address . '%' );
	}

	public function building_name( $building_name ) {
		$this->query->where( 'building_name', 'like', '%' . $building_name . '%' );
	}

	public function room_number( $room_number ) {
		$this->query->where( 'room_number', 'like', '%' . $room_number . '%' );
	}

	public function owner( $owner ) {
		$this->query->whereHas( 'owner', function ( $query ) use ( $owner ) {
			$query->where( 'name', 'like', '%' . $owner . '%' )->orWhere( 'email', 'like', '%' . $owner . '%' );
		} );
	}

	public function perPage( $val ) {
		$this->itemsPerPage = $val;
	}
}