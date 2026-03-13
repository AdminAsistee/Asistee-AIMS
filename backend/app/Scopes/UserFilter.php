<?php

namespace App\Scopes;

class UserFilter extends ModelFilter {

	public function type( $type ) {
		if ( is_array( $type ) ) {
			$this->query->whereIn( 'type', $type );
		} else if ( $type ) {
			$this->query->where( 'type', $type );
		}
	}

	public function email( $email ) {
		$this->query->where( 'email', 'like', '%' . $email . '%' );
	}

	public function name( $name ) {
		$this->query->where( 'name', 'like', '%' . $name . '%' );
	}

}