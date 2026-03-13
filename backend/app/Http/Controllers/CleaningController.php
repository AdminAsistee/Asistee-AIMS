<?php

namespace App\Http\Controllers;

use App\Scopes\UserFilter;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Cleaning;
use App\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;
use Illuminate\Pagination\Paginator;
use App\Scopes\CleaningFilter;

class CleaningController extends Controller {

	protected $validationRulesForCreation = [
		'location_id'   => 'required|integer|min:1|exists:locations,id',
		'cleaning_date' => 'required|date',
		'cleaner_id'    => 'sometimes|integer|min:1|exists:users,id',
		'price_id'      => 'sometimes|integer|min:1',
		'note_id'       => 'sometimes|integer|min:1',
		'start_time'    => 'sometimes|date|date_format:H:i',
		'end_time'      => 'sometimes|date|date_format:H:i',
	];

	protected $validationRulesForUpdate = [
		'cleaning_date'  => 'sometimes|date',
		// status
		'remove_cleaner' => [ 'boolean' ],
		'cleaner_id'     => [ 'integer', 'min:0', 'exists:users,id' ],
		// start_time: null,
		// end_time: null,
	];

	protected $updateable = [
		'administrator' => [
			'cleaning_date',
			'status',
			'remove_cleaner',
			'cleaner_id',
			'start_time',
			'end_time',
		],
		'supervisor'    => [
			'cleaning_date',
			'status',
			'remove_cleaner',
			'cleaner_id',
			'start_time',
			'end_time',
		],
		'client'        => [
			'cleaning_date',
			'status',
			'remove_cleaner',
		],
		'cleaner'       => [
			'cleaner_id',
		],
	];

	/**
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function store( Request $request ) {
		if ( $this->validationFails( $request->all(), $this->validationRulesForCreation ) ) {
			return $this->validationResponse;
		}
		$createdCleaning = Cleaning::create( $this->mutateForCreation( $request->all() ) );

		return $this->creationSuccessResponse( 'Cleaning', $createdCleaning->id );
	}

	/**
	 * @param CleaningFilter $filter
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function index( CleaningFilter $filter ) {
		if ( Gate::allows( 'operations' ) ) {
			$cleanings = Cleaning::filter( $filter )->with( [
				'location',
				'location.listings.bookings' => function ( $query ) {
					$query->where( 'checkin', '>=', Carbon::today() )->orderBy( 'checkin', 'asc' );
				},
				'cleaner'
			] )->orderBy( 'cleaning_date', 'asc' )->paginate( $filter->itemsPerPage );

			$collection = $cleanings->getCollection()->each( function ( $cleaning ) {
				$cleaning->tf_status    = false;
				$cleaning->next_booking = false;
				foreach ( $cleaning->location->listings as $listing ) {
					foreach ( $listing->bookings as $booking ) {
						if ( $booking->checkin >= $cleaning->cleaning_date ) {
							if ( $cleaning->next_booking === false ) {
								$cleaning->next_booking = $booking;
							} else if ( $booking->checkin < $cleaning->next_booking->checkin ) {
								$cleaning->next_booking = $booking;
							}
						}
						$cleaning_date = Carbon::parse( $cleaning->cleaning_date );
						if ( $cleaning_date->isSameDay( $booking->checkin ) ) {
							$cleaning->tf_status = true;
						}
					}
				}
			} );

			$cleanings->setCollection( $collection );

		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Cleaning' );
		}

		return response( $cleanings, 200 );

	}

	public function cleanerUsers( UserFilter $filter, Request $request ) {
		$request->merge( [ 'type' => 'cleaner' ] );
		$cleaners = User::filter( $filter )->get();

		return response( $cleaners, 200 );
	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function show( $id ) {
		$cleaning = $this->getCleaningWithTFAndNextBooking( $id );

		if ( Gate::allows( 'view_Cleaning', $cleaning ) ) {
			return response( $cleaning, 200 );
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Cleaning' );
		}

	}

	/**
	 * unassign cleaner from a cleaning by supervisor or admin
	 * This might get complicated in the future. so separating from update method to it's own method
	 *
	 * @param Request $request
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function unassignCleaner( Request $request ) {
		/** @var Cleaning $cleaning */
		$cleaning             = Cleaning::findOrFail( $request->cleaningId );
		$cleaning->cleaner_id = null;
		$cleaning->save();

		// todo: notify cleaner that he has been unassigned

		return response( $this->getCleaningWithTFAndNextBooking( $request->cleaningId ), 202 );
	}

	/**
	 * @param Request $request
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function assignCleaner( Request $request ) {
		/** @var Cleaning $cleaning */
		$cleaning             = Cleaning::findOrFail( $request->cleaningId );
		$user                 = User::findOrFail( $request->cleanerId );
		$cleaning->cleaner_id = $user->id;
		$cleaning->save();

		// todo: notify cleaner that he has been assigned

		return response( $this->getCleaningWithTFAndNextBooking( $request->cleaningId ), 202 );
	}

	/**
	 * @param Request $request
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function assignMe( Request $request ) {
		/** @var Cleaning $cleaning */
		$cleaning             = Cleaning::findOrFail( $request->cleaningId );
		$cleaning->cleaner_id = Auth::user()->id;
		$cleaning->save();

		// todo: notify cleaner that he has been assigned

		return response( $this->getCleaningWithTFAndNextBooking( $request->cleaningId ), 202 );
	}

	protected function getCleaningWithTFAndNextBooking( $id ) {
		$cleaning = Cleaning::with( [
			'location.listings.bookings' => function ( $query ) {
				$query->where( 'checkin', '>=', Carbon::today() )->orderBy( 'checkin', 'asc' );
			},
			'location.owner',
			'location.photos',
			'cleaner',
			'supplies'
		] )->findOrFail( $id );

		$cleaning->setAttribute( 'tf_status', false );
		$cleaning->setAttribute( 'next_booking', false );
		foreach ( $cleaning->location->listings as $listing ) {
			foreach ( $listing->bookings as $booking ) {
				if ( $booking->checkin >= $cleaning->cleaning_date ) {
					if ( $cleaning->next_booking === false ) {
						$cleaning->next_booking = $booking;
					} else if ( $booking->checkin < $cleaning->next_booking->checkin ) {
						$cleaning->next_booking = $booking;
					}
				}
				$cleaning_date = Carbon::parse( $cleaning->cleaning_date );
				if ( $cleaning_date->isSameDay( $booking->checkin ) ) {
					$cleaning->tf_status = true;
				}
			}
		}

		return $cleaning;
	}

	/**
	 * @param Cleaning $cleaning
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function update( Cleaning $cleaning, Request $request ) {
		// Authorize Update action
		if ( Gate::denies( 'update_Cleaning', $cleaning ) ) {
			return $this->AuthorizationFailureResponse( 'update', 'Cleaning' );
		}
		// catch cleaner trying to remove cleaner
		if ( Gate::allows( 'cleaner' ) && isset( $request['remove_cleaner'] ) ) {
			return $this->AuthorizationFailureResponse( 'remove', 'cleaner from cleaning' );
		}

		if ( count( $request->all() ) == 0 ) {
			return $this->updateFailureResponse( 'Cleaning', 'At least 1 parameter to update must be given.' );
		}

		// Validate Default Cleaning Parameters
		$valid_requests = $request->only( $this->updateable[ Auth::user()->type ] );

		if ( $this->validationFails( $valid_requests, $this->validationRulesForUpdate ) ) {
			return $this->validationResponse;
		}

		$cleaning->update( $this->mutateForUpdate( $valid_requests ) );

		return response( $this->getCleaningWithTFAndNextBooking( $cleaning->id ), 202 );
	}

	/**
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForUpdate( $request ) {
		// if cleaner , set cleaner id to self
		if ( Gate::allows( 'cleaner' ) ) {
			$request['cleaner_id'] = Auth::id();
		}
		// remove cleaner if remove flag set
		if ( isset( $request['remove_cleaner'] ) ) {
			$request['cleaner_id'] = null;
			unset( $request['remove_cleaner'] );
		}

		return $request;
	}
}
