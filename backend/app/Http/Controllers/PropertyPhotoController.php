<?php

namespace App\Http\Controllers;

use App\Location;
use App\PropertyPhoto;
use Illuminate\Http\Request;

class PropertyPhotoController extends Controller {
	public function delete( PropertyPhoto $photo ) {
		$user        = \Auth::user();
		$location_id = $photo->location_id;

		if ( $user->type == 'administrator' || $user->type == 'supervisor' || ( $user->type == 'client' && $photo->location->owner->id == $user->id ) ) {
			$photo->delete();
		} else {
			return $this->AuthorizationFailureResponse( 'delete', 'Photo not uploaded by you' );
		}

		return response( Location::with( [
			'cleanings.cleaner',
			'owner',
			'listings.bookings',
			'photos'
		] )->findOrFail( $location_id ), 200 );
	}
}
