<?php

namespace Tests\Feature\Booking;

use App\Booking;
use Laravel\Passport\Passport;
use Tests\TestCase;

class BookingCrudTest extends TestCase {

	protected $firstBooking;
	protected $secondBooking;
	private $firstListing;

	public function setUp() {
		parent::setUp();
		$this->firstBooking  = factory( Booking::class )->create( [ 
			'checkin'=>'2017-06-01',
			'checkout'=>'2017-07-01'] );
		$this->secondBooking = factory( Booking::class )->create();
		$this->firstListing  = factory( \App\Listing::class )->create();
		factory( Booking::class, 8 )->create();
	}
 
	/** @test */
	public function admin_can_create_booking() {
		Passport::actingAs( $this->adminTypeUser );
		$this->post( '/api/v1/bookings', [
			// NO LISTING###
			'listing_id'            => 1,
			'checkin'               => '2017-05-05',
			'checkout'              => '2017-05-08',
			// 'planned_checkin_time'  => '18:00',
			// 'planned_checkout_time' => '11:30',
			'guests'                => '2',
			'beds'                  => '2',
		] )->assertStatus( 201 );

	}

	// // Moved to UpdateBookingTest.php
	// /** @test */
	// public function admin_can_edit_booking_data() {
	// 	Passport::actingAs( $this->adminTypeUser );
	// 	$this->put( '/api/v1/bookings/1', [ 'guests' => 10, 'beds' => 5 ] )->assertStatus( 202 );

	// }

	/** @test */
	public function guest_can_not_create_booking() {
		Passport::actingAs( $this->guestUser );
		$tempBooking = factory( Booking::class )->make();
		$this->post( '/api/v1/bookings', $tempBooking->toArray() )
		     ->assertStatus( 401 );
	}

	// // Moved to ReadBookingTest.php
	// /** @test */
	// public function admin_can_see_list_of_bookings() {
	// 	Passport::actingAs( $this->adminTypeUser );
	// 	$this->get( '/api/v1/bookings' )->assertStatus( 200 )
	// 	     ->assertJsonFragment( [ 'id' => 1 ] )
	// 	     ->assertJsonFragment( [ 'id' => 5 ] );
	// }

	/** @test */
	public function admin_can_see_a_single_booking() {
		Passport::actingAs( $this->adminTypeUser );
		$this->get( '/api/v1/bookings/1' )->assertStatus( 200 )
		     ->assertJsonFragment( [ 'id' => 1 ] )
		     ->assertJsonMissing( [ 'id' => 2 ] );
	}

	/** @test */
	public function admin_can_delete_a_booking() {
		Passport::actingAs( $this->adminTypeUser );
		$this->delete( '/api/v1/bookings/1' )->assertStatus( 202 );
	}

	/** @test */
	public function guest_can_not_delete_a_booking() {
		Passport::actingAs( $this->guestUser );
		$this->delete( '/api/v1/bookings/1' )->assertStatus( 401 );
	}


// Should probably be 4XX, not 500. 
	/** @test */
	public function admin_can_not_delete_a_non_existing_booking() {
		Passport::actingAs( $this->adminTypeUser );
		$this->delete( '/api/v1/bookings/1000' )->assertStatus( 422 );
	}
}
