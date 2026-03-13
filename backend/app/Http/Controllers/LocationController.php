<?php

namespace App\Http\Controllers;

use App\Location;
use App\Listing;
use App\PropertyPhoto;
use App\Scopes\LocationFilter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class LocationController extends Controller {
	protected $validationRulesForCreation = [
		'building_name' => 'required|min:2',
		'room_number'   => 'required|integer|min:0',
		'address'       => 'required',
		'latitude'      => 'required|numeric|min:-90|max:90',
		'longitude'     => 'required|numeric|min:0|max:180',
		'owner_id'      => 'required|integer|min:1',
		'map_link'      => 'required|string',
		'entry_info'    => 'required|string',
	];

	protected $validationRulesForAddListing = [
		'listing_id'  => 'required|exists:listings,id',
		'location_id' => 'required|exists:locations,id',
	];

	public function __construct() {
		$this->middleware( 'auth' );
	}

	public function create( Request $request ) {
		if ( Gate::allows( 'create_Location', Location::class ) ) {

			if ( $this->validationFails( $request->all(), $this->validationRulesForCreation ) ) {
				return $this->validationResponse;
			}

			$createdLocation = Location::create( $this->mutateForCreation( $request->all() ) );

			return $this->creationSuccessResponse( 'Location', $createdLocation->id );
		} else {
			return $this->AuthorizationFailureResponse( 'create', 'Location' );
		}


	}

	/**
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForCreation(array $request = []): array {
		$request['address'] = utf8_encode( $request['address'] );
		$user               = Auth::user();
		if ( $user->type == 'client' ) {
			$request['owner_id'] = $user->id;
		}

		return $request;
	}

	/**
	 * @param LocationFilter $filter
	 *
	 * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function index( LocationFilter $filter ) {
		if ( Gate::allows( 'kankeisha' ) ) {
			return Location::filter( $filter )->with( 'owner' )->orderBy( 'id', 'desc' )->paginate( $filter->itemsPerPage );
		} elseif ( Gate::allows( 'client', Location::class ) ) {
			return Location::filter( $filter )->with( 'owner' )->where( [ 'owner_id' => Auth::user()->id ] )->paginate( $filter->itemsPerPage );
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}

	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|\Symfony\Component\HttpFoundation\Response
	 */
	public function show( $id ) {
		$location = Location::with( [
			'cleanings.cleaner',
			'owner',
			'listings.bookings',
			'photos'
		] )->findOrFail( $id );
		if ( Gate::allows( 'view_Location', $location ) ) {
			return $location;
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}
	}

	public function addListing( Request $request ) {
		// fail if request malformed
		if ( $this->validationFails( $request->all(), $this->validationRulesForAddListing ) ) {
			return $this->validationResponse;
		}

		// validation should go to validation array (moved 2 of them... need to move the last one)
		// this path should produce success only, error should be caught by validation

		$success     = true;
		$message     = null;
		$listing_id  = $request->listing_id;
		$location_id = $request->location_id;
		$location    = Location::find( $location_id );
		$listing     = Listing::find( $listing_id );

		// fail if unauthorized
		if ( Gate::denies( 'update_Location', $location ) ) {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		} // Not nesting because eventually listing will also need to be authenticated

		if ( $location->listings->contains( $listing ) ) {
			$success = false;
			$message = 'Location already Associated.';
		} else {
			$location->listings()->save( $listing );
		}


		return $this->associationResponse( 'Listing/' . $listing_id, 'Location/' . $location_id, $success, $message );
		// return [ 'success'=>true, 'listing'=>$listing, 'location'=>$location, 'listing_locations'=>$listing->locations];
	}

	public function viewBookings( Location $location ) {

		if ( Gate::allows( 'view_Location', $location ) ) {
			return $location->listings->map( function ( $listing ) {
				return $listing->bookings;
			} )->flatten();
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}

	}

	public function uploadPhoto( $location_id, Request $request ) {
		$user               = \Auth::user();
		$path               = \Storage::putFile( "public/photos/{$location_id}", $request->file( 'photo' ) );
		$photo              = new PropertyPhoto();
		$photo->user_id     = $user->id;
		$photo->location_id = $location_id;
		$photo->full_path   = $path;
		$photo->type        = 'location_photo';
		$photo->name        = $request->file( 'photo' )->getClientOriginalName();

		// create thumb
		$thumb = \Image::make( $request->photo )->widen( 600 );
		$hash  = md5( $request->photo->hashName() );
		\Storage::makeDirectory( "/public/thumbs/{$location_id}" );
		$thumb_path = "/storage/thumbs/{$location_id}/{$hash}.jpg";
		$thumb->save( public_path( $thumb_path ) );

		$photo->thumb_path = str_replace( '/storage', 'public', $thumb_path );

		$photo->save();

		return response( Location::with( [
			'cleanings.cleaner',
			'owner',
			'listings.bookings',
			'photos'
		] )->findOrFail( $location_id ), 200 );
	}

	public function viewListings( Location $location ) {
		if ( Gate::allows( 'view_Location', $location ) ) {
			return $location->listings;
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}
	}

	public function getOpenProperties( Request $request ){
		$start_date = $request['start_date'];
		$end_date = $request['end_date'];

		// Not implemented yet. 
		// Explanation: To determine OVERLAP of bookings, you must use STRICT comparisons (< and >). This will not, however, display items that do not wholely overlap. In most cases, what we mean by "Open Properties" are ones that do not have a booking for that night, so we want CHECKINs to be displayed as well. Our primary use case for this is to have start_date = end_date, to see what properties are occupied that date's NIGHT. (ie: a guest will be there on that date at 8pm or so). With strict comparisons, this case is not caught, and will display a date with checkout and checkin as "Open". While Strict overlapping is good for more stricter contstraints (ie: Catching a possible double-booking), In our usage of this particular API call, we want to see apartments that are available during the daytime and at night.
		// The switch would be implemented by replacing the following segment of code:
		// $q->where('checkin',$overlap_switch, $end_date)
		//
		// Again, STRICT (<) shows OVERLAP
		// LENIENT (<=) shows OCCUPIED
		$switch = true;
		$overlap_switch = $switch ? '<=' : '<';

		$raw_output = Location::with(["listings.bookings" => function($q) use ($end_date, $start_date){$q->where('checkin','<=', $end_date)->where('checkout','>', $start_date);}])->get();

		$raw_output = $raw_output->filter(function($item){return $item->listings->count() > 0;});

		$raw_output = $raw_output->map(function($location){return $location->listings->map(function($listing) use ($location){return ['location'=>$location,'bookings_count'=>$listing->bookings->count()];});})->flatten(1)->filter(function($item){return $item['bookings_count'] == 0;});

		 return $raw_output->flatten(1)->filter(function($item){return $item instanceof Location;});
	}


}
