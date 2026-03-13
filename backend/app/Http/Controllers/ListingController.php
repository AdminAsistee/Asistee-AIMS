<?php

namespace App\Http\Controllers;

use App\Listing;
use App\Location;
use App\Scopes\ListingFilter;
use Illuminate\Http\Request;

class ListingController extends Controller {
	protected $validationRulesForCreation = [
		'channel_account_id' => 'required|integer|min:1',
		'channel_listing_id' => 'required',
		'status'             => 'in:newly_created,active,suspended,discontinued'
		//Rule::in(['newly_created','active', 'suspended', 'discontinued']),
	];

	public function register( Request $request ) {
		if ( $this->validationFails( $request->all(), $this->validationRulesForCreation ) ) {
			return $this->validationResponse;
		}

		$createdLocation = Listing::create( $this->makeFromRequest( $request ) );

		return $this->creationSuccessResponse( 'Listing', $createdLocation->id );
	}

	/**
	 * @param Request $request
	 *
	 * @return array
	 */
	private function makeFromRequest( Request $request ) {
		$array_request = [
			'channel_account_id' => $request->get( 'channel_account_id' ),
			'channel_listing_id' => $request->get( 'channel_listing_id' ),
		];
		if ( $request->get( 'status' ) ) {
			$array_request['status'] = $request->get( 'status' );
		}

		return $array_request;
	}

	/**
	 * @param ListingFilter $filter
	 *
	 * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection|static[]
	 */
	public function index( ListingFilter $filter ) {
		if ( \Gate::allows( 'operations' ) ) {
			return Listing::filter( $filter )->orderBy( 'id', 'desc' )->paginate( $filter->itemsPerPage );
		}

		return $this->AuthorizationFailureResponse( 'view', 'Listing' );
	}

	public function show( Listing $listing ) {
		return $listing;
	}

	public function addLocation( Request $request ) {
		$success     = true;
		$message     = null;
		$listing_id  = $request->get( 'listing_id' );
		$location_id = $request->get( 'location_id' );
		$listing     = Listing::find( $listing_id );
		if ( is_null( $listing ) ) {
			$success = false;
			$message = 'Listing Does Not Exist.';
		} else {
			$location = Location::find( $location_id );
			if ( is_null( $location ) ) {
				$success = false;
				$message = 'Location Does Not Exist.';
			} else {
				if ( $listing->locations->contains( $location ) ) {
					$success = false;
					$message = 'Location already Associated.';
				} else {
					$listing->locations()->save( $location );
				}
			}
		}

		return $this->associationResponse( 'Listing/' . $listing_id, 'Location/' . $location_id, $success, $message );
	}
}
