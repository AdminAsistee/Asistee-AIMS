<?php

namespace App\Http\Controllers;

use App\Rules\DateGreater;
use App\Rules\DateLess;
use App\Rules\LessOrEqual;
use App\Scopes\BookingFilter;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Booking;
use App\Listing;


class BookingController extends Controller {
	protected $validationRulesForCreation = [
		'listing_id' => 'required|integer|min:1|exists:listings,id',
		//custom validator rules moved to app/Rules folder on individual Rules class
		'checkin'    => [ 'required', 'date' ],
		'checkout'   => [ 'required', 'date' ],
		// Beds is not required, so cannot require guests number be greater_than_equal:bed with
		'guests'     => [ 'required', 'min:1', 'max:1000' ],
		'beds'       => [ 'sometimes', 'integer', 'min:0' ],
		// 'planned_checkin_time'			=> 'sometimes|date',
		// 'planned_checkout_time'			=> 'sometimes|date',
		// 'guest_id'						=> 'sometimes|integer|min:1',
		// 'status'						=> 'required',
		// 'note'						=> 'sometimes|string',
		// 'price_id'						=> 'sometimes|integer|min:1',
		// 'guest_cleaning_feedback_id'	=> 'sometimes|integer|min:1',
		// 'guest_stay_feedback_id'		=> 'sometimes|integer|min:1',
		// 'cleaner_feedback_id'			=> 'sometimes|integer|min:1',
	];

	protected $validationRulesForUpdate = [
		'checkin'  => [ 'date' ],
		'checkout' => [ 'date' ],
		// 'planned_checkin_time'  => 'string',
		// 'planned_checkout_time' => 'string',
		'guests'   => [ 'integer', 'min:1', 'max:1000' ],
		'beds'     => [ 'integer', 'min:0' ],

		// 'checkin'   	=> 'date|date_less_than:checkout',
		// 'checkout'   => 'date|date_greater_than:checkin',
		// 'guests'		=> 'min:1|max:1000',
		// 'beds'		=> 'integer|min:0|less_than_equal:guests',
	];

	protected $validationRulesForDeletion = [];

	protected $updateable = [
		'administrator' => [
			'checkin',
			'checkout',
			'planned_checkin_time',
			'planned_checkout_time',
			'guests',
			'beds',
		],
		'client'        => [
			'checkin',
			'checkout',
			'planned_checkin_time',
			'planned_checkout_time',
			'guests',
			'beds',
		]
	];

	public function __construct( Request $request ) {
		// load custom validator rules
		$this->validationRulesForCreation['beds'][]     = new LessOrEqual( $request->guests, 'guests' );
		$this->validationRulesForCreation['checkin'][]  = new DateLess( $request->checkout, 'checkout' );
		$this->validationRulesForCreation['checkout'][] = new DateGreater( $request->checkin, 'checkin' );

		// Update validations can't work here because no values are guaranteed to exist, and need booking ID (which is only available in the update method itself) to get the other values needed to be able to validate method here.

	}

	/**
	 * @param BookingFilter $filter
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function index( BookingFilter $filter ) {
		$bookings = Booking::with( ['listing.locations', 'listing.channel_account', 'source_channel_account'] )->filter( $filter )
		                   ->orderBy( 'checkin', 'asc' )//->count();
		                   ->paginate( $filter->itemsPerPage );

		return response( $bookings, 200 );
	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function show( $id ) {
		$booking_temp = Booking::findOrFail( $id );
		$booking      = Booking::with( [
			'listing.locations.owner',
			'listing.locations.cleanings' => function ( $query ) use ( $booking_temp ) {
				$query->where( 'cleaning_date', '<=', $booking_temp->checkin )
				      ->where( 'cleaning_date', '>=', Carbon::parse( $booking_temp->checkin )->subDays( 7 ) )
				      ->orderBy( 'cleaning_date', 'desc' );
			}
		] )->findOrFail( $id );

		$booking->listing->locations->each( function ( $location ) use ( $booking ) {

			$location->tf_status         = false;
			$location->previous_cleaning = false;

			foreach ( $location->cleanings as $cleaning ) {
				if ( $cleaning->cleaning_date <= $booking->checkin ) {
					if ( $location->previous_cleaning === false ) {
						$location->previous_cleaning = $cleaning;
					} else if ( $cleaning->cleaning_date > $location->previous_cleaning->cleaning_date ) {
						$location->previous_cleaning = $cleaning;
					}
				}
				$cleaning_date = Carbon::parse( $cleaning->cleaning_date );
				if ( $cleaning_date->isSameDay( $booking->checkin ) ) {
					$location->tf_status = true;
				}
			}

		} );

		return response( $booking, 200 );
	}

	//name register vs store ?
	//store is the default name for creating new entry in database. register is used for user registration only
	/**
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function store( Request $request ) {
		if ( $this->validationFails( $request->all(), $this->validationRulesForCreation ) ) {
			return $this->validationResponse;
		}
// Validate Overlapping Bookings
		$overlappingBookings = Listing::find( $request->get( 'listing_id' ) )->locations
			->map( function ( $location ) {
				return $location->listings;
			} )->unique()->flatten()
			->map( function ( $listing ) use ( $request ) {
				return $listing->bookings
					->where( 'checkin', '<', $request->get( 'checkout' ) )
					->where( 'checkout', '>', $request->get( 'checkin' ) );
			} )->unique()->flatten();

		if ( $overlappingBookings->count() > 0 ) {
			return $this->creationFailureResponse( 'Booking', 'This Booking Overlaps with another existing booking.' );
		}

		$createdBooking = Booking::create( $this->mutateForCreation( $request->all() ) );

		return $this->creationSuccessResponse( 'Booking', $createdBooking->id );
	}

	/**
	 * Mutate necessary fields before creation
	 *
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForCreation(array $request = []): array {
		if ( ! isset( $request['beds'] ) ) {
			$request['beds'] = $request['guests'];
		}

		return $request;
	}


	/**
	 * @param Booking $booking
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function update( Booking $booking, Request $request ) {
// Validate Default Booking Parameters
		$valid_requests = $request->only( $this->updateable[ \Auth::user()->type ] );
		if ( $this->validationFails( $valid_requests, $this->validationRulesForUpdate ) ) {
			return $this->validationResponse;
		}
		if ( count( $request->all() ) == 0 ) {
			return $this->updateFailureResponse( 'Booking', 'At least 1 parameter to update must be given.' );
		}
// Validate Guest/Bed Ratio
		$beds   = $request->get( 'beds' ) ? $request->get( 'beds' ) : $booking->beds;
		$guests = $request->get( 'guests' ) ? $request->get( 'guests' ) : $booking->guests;
		if ( $beds > $guests ) {
			return $this->updateFailureResponse( 'Booking', 'Beds (' . $beds . ') must be less than or equal to guests (' . $guests . ').' );
		}

// Validate Booking Checkin/checkout direction
		$checkin  = $request->get( 'checkin' ) ? $request->get( 'checkin' ) : $booking->checkin->format( 'Y-m-d' );
		$checkout = $request->get( 'checkout' ) ? $request->get( 'checkout' ) : $booking->checkout->format( 'Y-m-d' );
		if ( $checkin >= $checkout ) {
			return $this->updateFailureResponse( 'Booking', 'checkin (' . $checkin . ') must be before checkout (' . $checkout . ').' );
		}
// Validate Booking Overlap
		$overlappingBookings = Listing::find( $booking->listing_id )->locations
			->map( function ( $location ) use ( $checkout, $checkin, $booking ) {
				return $location->listings;
			} )->unique()->flatten()
			->map( function ( $listing ) use ( $checkout, $checkin, $booking ) {
				return $listing->bookings
					->where( 'checkin', '<', $checkout )
					->where( 'checkout', '>', $checkin )
					->where( 'id', '!=', $booking->id );
			} )->unique()->flatten();

		if ( $overlappingBookings->count() > 0 ) {
			return $this->updateFailureResponse( 'Booking', 'This Booking Overlaps with another existing booking: ' . $overlappingBookings );
		}

		// Uncomment For Debugging.
		// return response( [ 'checkout' => $checkout,
		// 	'checkin' => $checkin,
		// 	'booking' => $booking,
		// 	'bookingListing' => $bookingListing,
		// 	'listingLocations' => $listingLocations,
		// 	'locationsListings' => $locationsListings,
		// 	'overlappingBookings' => $overlappingBookings, ], 422 );

		$booking->update( $this->mutateForUpdate( $valid_requests ) );

		// TODO : Update Cleanings

//		return $this->updateSuccessResponse( 'Booking' );
		return response( Booking::with( 'listing.locations.owner' )->findOrFail( $booking->id ), 202 );
	}

	/**
	 * @param Booking $booking
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function delete( Booking $booking ) {
		if ( $this->validationFails( [ 'id' => $booking->id ], $this->validationRulesForDeletion ) ) {
			return $this->validationResponse;
		}
		$booking->delete();

		return $this->deleteSuccessResponse( 'Booking' );
	}


}
