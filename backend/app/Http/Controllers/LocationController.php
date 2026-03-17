<?php

namespace App\Http\Controllers;

use App\Location;
use App\Listing;
use App\Channel;
use App\ChannelAccount;
use App\PropertyPhoto;
use App\Scopes\LocationFilter;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class LocationController extends Controller {
	protected $validationRulesForCreation = [
		'building_name'               => 'required|min:2',
		'room_number'                 => 'required|integer|min:0',
		'address'                     => 'required',
		'latitude'                    => 'required|numeric|min:-90|max:90',
		'longitude'                   => 'required|numeric|min:0|max:180',
		'owner_id'                    => 'required|integer|min:1',
		'map_link'                    => 'required|string',
		'entry_info'                  => 'required|string',
		// Optional fields
		'mail_rules'                  => 'nullable|string',
		'trash_rules'                 => 'nullable|string',
		'guest_photo_directions_link' => 'nullable|url',
		'max_beds'                    => 'nullable|integer|min:0',
		'per_bed_charge'              => 'nullable|numeric|min:0',
		'per_guest_charge'            => 'nullable|numeric|min:0',
		'SplitRate'                   => 'nullable|numeric|min:0|max:1',
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

			// ── Auto-create a Manual channel account (if missing) + listing ──
			$manualChannel  = Channel::firstOrCreate([]);
			$channelAccount = ChannelAccount::firstOrCreate(
				['channel_id' => $manualChannel->id],
				['description' => 'Manual Bookings', 'channel_id' => $manualChannel->id]
			);

			$listing = Listing::create([
				'listing_title'      => $createdLocation->building_name . ' #' . $createdLocation->room_number,
				'channel_account_id' => $channelAccount->id,
				'channel_listing_id' => 'manual-' . $createdLocation->id,
				'status'             => 'active',
			]);

			$createdLocation->listings()->save($listing);

			return $this->creationSuccessResponse( 'Location', $createdLocation->id );
		} else {
			return $this->AuthorizationFailureResponse( 'create', 'Location' );
		}
	}

	protected function mutateForCreation(array $request = []): array {
		$request['address'] = utf8_encode( $request['address'] );
		$user               = Auth::user();
		if ( $user->type == 'client' ) {
			$request['owner_id'] = $user->id;
		}
		return $request;
	}

	public function index( LocationFilter $filter ) {
		if ( Gate::allows( 'kankeisha' ) ) {
			return Location::filter( $filter )->with( ['owner', 'listings'] )->orderBy( 'id', 'desc' )->paginate( $filter->itemsPerPage );
		} elseif ( Gate::allows( 'client', Location::class ) ) {
			return Location::filter( $filter )->with( ['owner', 'listings'] )->where( [ 'owner_id' => Auth::user()->id ] )->paginate( $filter->itemsPerPage );
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}
	}

	public function show( $id ) {
		$location = Location::with( [
			'cleanings.cleaner',
			'owner',
			'listings.bookings',
			'listings.channel_account',
			'photos'
		] )->findOrFail( $id );

		// Compute tf_status for each cleaning (same logic as CleaningController):
		// a cleaning is a TF (turnover) day when its date matches a booking checkin at this location.
		$allBookings = $location->listings->flatMap( fn( $l ) => $l->bookings );
		foreach ( $location->cleanings as $cleaning ) {
			$cleaning->tf_status = false;
			$cleaningDate = Carbon::parse( $cleaning->cleaning_date );
			foreach ( $allBookings as $booking ) {
				if ( $booking->checkin && $cleaningDate->isSameDay( Carbon::parse( $booking->checkin ) ) ) {
					$cleaning->tf_status = true;
					break;
				}
			}
		}

		if ( Gate::allows( 'view_Location', $location ) ) {
			return $location;
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}
	}

	public function addListing( Request $request ) {
		if ( $this->validationFails( $request->all(), $this->validationRulesForAddListing ) ) {
			return $this->validationResponse;
		}

		$success     = true;
		$message     = null;
		$listing_id  = $request->listing_id;
		$location_id = $request->location_id;
		$location    = Location::find( $location_id );
		$listing     = Listing::find( $listing_id );

		if ( Gate::denies( 'update_Location', $location ) ) {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}

		if ( $location->listings->contains( $listing ) ) {
			$success = false;
			$message = 'Location already Associated.';
		} else {
			$location->listings()->save( $listing );
		}

		return $this->associationResponse( 'Listing/' . $listing_id, 'Location/' . $location_id, $success, $message );
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

	/**
	 * Upload a photo for a location.
	 * Stores directly in public/uploads/photos/{id}/ — no storage:link symlink needed in dev.
	 */
	public function uploadPhoto( $location_id, Request $request ) {
		$user = \Auth::user();
		$file = $request->file('photo');
		if ( !$file ) {
			return response( ['message' => 'No photo file received.'], 422 );
		}

		$dir = public_path( "uploads/photos/{$location_id}" );
		if ( !file_exists( $dir ) ) {
			mkdir( $dir, 0755, true );
		}
		$filename     = time() . '_' . preg_replace( '/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName() );
		$file->move( $dir, $filename );
		$relativePath = "/uploads/photos/{$location_id}/{$filename}";

		$photo              = new PropertyPhoto();
		$photo->user_id     = $user->id;
		$photo->location_id = $location_id;
		$photo->full_path   = $relativePath;
		$photo->thumb_path  = $relativePath;
		$photo->type        = 'location_photo';
		$photo->name        = $file->getClientOriginalName();
		$photo->save();

		return response( Location::with( [
			'cleanings.cleaner', 'owner', 'listings.bookings', 'listings.channel_account', 'photos'
		] )->findOrFail( $location_id ), 200 );
	}

	public function viewListings( Location $location ) {
		if ( Gate::allows( 'view_Location', $location ) ) {
			return $location->listings;
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Location' );
		}
	}

	public function getOpenProperties( Request $request ) {
		$start_date     = $request['start_date'];
		$end_date       = $request['end_date'];
		$switch         = true;
		$overlap_switch = $switch ? '<=' : '<';

		$raw_output = Location::with( ["listings.bookings" => function ( $q ) use ( $end_date, $start_date ) {
			$q->where( 'checkin', '<=', $end_date )->where( 'checkout', '>', $start_date );
		}] )->get();

		$raw_output = $raw_output->filter( function ( $item ) {
			return $item->listings->count() > 0;
		} );

		$raw_output = $raw_output->map( function ( $location ) {
			return $location->listings->map( function ( $listing ) use ( $location ) {
				return ['location' => $location, 'bookings_count' => $listing->bookings->count()];
			} );
		} )->flatten( 1 )->filter( function ( $item ) {
			return $item['bookings_count'] == 0;
		} );

		return $raw_output->flatten( 1 )->filter( function ( $item ) {
			return $item instanceof Location;
		} );
	}

	/**
	 * Delete a location — blocked if any upcoming bookings exist across its listings.
	 */
	public function delete( Location $location ) {
		if ( Gate::denies( 'update_Location', $location ) ) {
			return $this->AuthorizationFailureResponse( 'delete', 'Location' );
		}

		$hasUpcoming = $location->listings->flatMap( function ( $listing ) {
			return $listing->bookings->filter( function ( $booking ) {
				return $booking->checkout >= now()->toDateString();
			} );
		} )->isNotEmpty();

		if ( $hasUpcoming ) {
			return response( [
				'message' => 'Cannot delete location: it has upcoming or active bookings.',
				'success' => false,
			], 422 );
		}

		$location->delete();

		return response( [
			'message' => 'Location deleted successfully.',
			'success' => true,
		], 200 );
	}

	public function update( Location $location, Request $request ) {
		if ( Gate::denies( 'update_Location', $location ) ) {
			return $this->AuthorizationFailureResponse( 'update', 'Location' );
		}

		$allowed = [
			'building_name', 'room_number', 'address', 'latitude', 'longitude',
			'owner_id', 'map_link', 'entry_info', 'mail_rules', 'trash_rules',
			'guest_photo_directions_link', 'max_beds', 'per_bed_charge',
			'per_guest_charge', 'SplitRate',
		];

		$data = $request->only( $allowed );

		$rules = [
			'building_name'               => 'sometimes|min:2',
			'room_number'                 => 'sometimes|integer|min:0',
			'address'                     => 'sometimes|string',
			'latitude'                    => 'sometimes|numeric|min:-90|max:90',
			'longitude'                   => 'sometimes|numeric|min:0|max:180',
			'owner_id'                    => 'sometimes|integer|min:1',
			'map_link'                    => 'sometimes|string',
			'entry_info'                  => 'sometimes|string',
			'mail_rules'                  => 'nullable|string',
			'trash_rules'                 => 'nullable|string',
			'guest_photo_directions_link' => 'nullable|url',
			'max_beds'                    => 'nullable|integer|min:0',
		];

		if ( $this->validationFails( $data, $rules ) ) {
			return $this->validationResponse;
		}

		$location->update( $data );

		return response( Location::with( [
			'cleanings.cleaner', 'owner', 'listings.bookings', 'listings.channel_account', 'photos'
		] )->findOrFail( $location->id ), 200 );
	}

}
