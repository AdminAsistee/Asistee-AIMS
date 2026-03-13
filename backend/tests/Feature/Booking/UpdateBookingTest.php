<?php

namespace Tests\Feature\Booking;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Booking;
use App\Listing;
use App\Location;
use Laravel\Passport\Passport;

class UpdateBookingTest extends TestCase
{

	public function setUp() {
		parent::setUp();
		$this->random_location  = factory( Location::class )->create();
		$this->random_listing  = factory( Listing::class )->create();
		$this->random_listing->locations()->save($this->random_location);
		$this->firstBooking  = factory( Booking::class )->create( [
			'listing_id'=>1,
			'checkin'=>'2018-01-01',
			'checkout'=>'2018-02-01',
			'guests'=>5,
			'beds'=>4,
		]);
		Passport::actingAs( $this->adminTypeUser );
	}

    /** @test */
	public function admin_can_edit_booking_guest_beds_data() {
		$this->put( '/api/v1/bookings/1', [ 'guests' => 10, 'beds' => 5 ] )->assertStatus( 202 );
	}

	// NOTE : This test assumes setup function's 5G/4B
	/** @test */
	public function admin_can_edit_booking_guest_beds_data_where_update_order_may_cause_conflict() {
		$this->put( '/api/v1/bookings/1', [ 'guests' => 250, 'beds' => 249 ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_edit_booking_guest_beds_data_where_update_order_may_cause_conflict_reverse() {
		$this->put( '/api/v1/bookings/1', [ 'beds' => 249, 'guests' => 250 ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_cannot_edit_booking_guest_beds_incorrect_ratio() {
		$this->put( '/api/v1/bookings/1', [ 'guests' => 8, 'beds' => 15 ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_negative_beds() {
		$this->put( '/api/v1/bookings/1', [ 'beds' => -1 ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_negative_guests() {
		$this->put( '/api/v1/bookings/1', [ 'guests' => -4 ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_can_edit_booking_zero_beds() {
		$this->put( '/api/v1/bookings/1', [ 'beds' => 0 ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_cannot_edit_booking_zero_guests() {
		$this->put( '/api/v1/bookings/1', [ 'guests' => 0 ] )->assertStatus( 422 );
	}

// potential conflict might happen here.
	/** @test */
	public function admin_can_edit_booking_checkin_checkout_data() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-15', 'checkout' => '2018-02-15' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_edit_booking_checkin_only() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-03' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_edit_booking_checkout_only() {
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2018-01-29' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_cannot_edit_booking_invalid_checkin_checkout_ratio() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-15', 'checkout' => '2017-02-15' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_invalid_checkin_checkout_ratio_edge_case() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-15', 'checkout' => '2018-01-14' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_invalid_checkin_checkout_ratio_same_edge_case() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-15', 'checkout' => '2018-01-15' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_checkin_only_to_checkout_date() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-02-01' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_checkout_only_to_checkin_date() {
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2018-01-01' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_checkin_only_past_checkout_date() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-02-14' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_checkout_only_past_checkin_date() {
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2017-12-22' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_can_edit_booking_checkin_only_to_1_day_before_checkout_date() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-31' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_edit_booking_checkout_only_to_1_day_after_checkin_date() {
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2018-01-02' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_edit_booking_checkin_checkout_1_day_edge_case() {
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-15', 'checkout' => '2018-01-16' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_cannot_edit_booking_overlap_double() {
		factory( Booking::class )->create( [
			'listing_id'=>1,
			'checkin'=>'2018-02-15',
			'checkout'=>'2018-03-01',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-01-15', 'checkout' => '2018-03-15' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_can_edit_booking_overlap_double_with_poential_conflict_before() {
		factory( Booking::class )->create( [
			'listing_id'=>1,
			'checkin'=>'2018-02-15',
			'checkout'=>'2018-03-01',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2018-03-15', 'checkout' => '2018-04-15' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_edit_booking_overlap_double_with_poential_conflict_after() {
		factory( Booking::class )->create( [
			'listing_id'=>1,
			'checkin'=>'2017-11-15',
			'checkout'=>'2017-12-01',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2017-10-15', 'checkout' => '2017-11-01' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_cannot_edit_booking_overlap_checkin() {
		factory( Booking::class )->create( [
			'listing_id'=>1,
			'checkin'=>'2017-11-15',
			'checkout'=>'2017-12-09',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2017-12-01' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_overlap_checkout() {
		factory( Booking::class )->create( [
			'listing_id'=>1,
			'checkin'=>'2018-02-15',
			'checkout'=>'2018-03-01',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2018-02-23' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_overlap_checkout_into_lis_loc_lis_chain() {
		$second_Listing = factory( Listing::class )->create();
		$common_location = factory( Location::class )->create();
		$common_location->listings()->save($this->random_listing);
		$common_location->listings()->save($second_Listing); 
		factory( Booking::class )->create( [
			'listing_id'=>2,
			'checkin'=>'2018-02-05',
			'checkout'=>'2018-03-01',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2018-02-13' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_overlap_checkout_over_lis_loc_lis_chain() {
		$second_Listing = factory( Listing::class )->create();
		$common_location = factory( Location::class )->create();
		$common_location->listings()->save($this->random_listing);
		$common_location->listings()->save($second_Listing); 
		factory( Booking::class )->create( [
			'listing_id'=>2,
			'checkin'=>'2018-02-05',
			'checkout'=>'2018-03-01',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2018-03-13' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_overlap_checkin_into_lis_loc_lis_chain() {
		$second_Listing = factory( Listing::class )->create();
		$common_location = factory( Location::class )->create();
		$common_location->listings()->save($this->random_listing);
		$common_location->listings()->save($second_Listing); 
		factory( Booking::class )->create( [
			'listing_id'=>2,
			'checkin'=>'2017-12-15',
			'checkout'=>'2017-12-25',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2017-12-21' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_cannot_edit_booking_overlap_checkin_over_lis_loc_lis_chain() {
		$second_Listing = factory( Listing::class )->create();
		$common_location = factory( Location::class )->create();
		$common_location->listings()->save($this->random_listing);
		$common_location->listings()->save($second_Listing); 
		factory( Booking::class )->create( [
			'listing_id'=>2,
			'checkin'=>'2017-12-15',
			'checkout'=>'2017-12-25',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2017-11-07' ] )->assertStatus( 422 );
	}

	/** @test */
	public function admin_can_edit_booking_checkout_and_checkout_over_lis_loc_lis_chain_after() {
		$second_Listing = factory( Listing::class )->create();
		$common_location = factory( Location::class )->create();
		$common_location->listings()->save($this->random_listing);
		$common_location->listings()->save($second_Listing); 
		factory( Booking::class )->create( [
			'listing_id'=>2,
			'checkin'=>'2018-02-05',
			'checkout'=>'2018-03-01',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkout' => '2018-03-13' , 'checkin' => '2018-03-04' ] )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_edit_booking_checkout_and_checkout_over_lis_loc_lis_chain_before() {
		$second_Listing = factory( Listing::class )->create();
		$common_location = factory( Location::class )->create();
		$common_location->listings()->save($this->random_listing);
		$common_location->listings()->save($second_Listing); 
		factory( Booking::class )->create( [
			'listing_id'=>2,
			'checkin'=>'2017-12-15',
			'checkout'=>'2017-12-25',
		]);
		$this->put( '/api/v1/bookings/1', [ 'checkin' => '2017-11-07' , 'checkout' => '2017-11-26' ] )->assertStatus( 202 );
	}

//////////////////////////////////////////////////////////////////////

	/** @test */
	public function guest_edit_of_booking_should_fail() {
		Passport::actingAs( $this->guestUser );
		$this->put( '/api/v1/bookings/1', [ 'guests' => 40, 'beds' => 2, 'checkin' => '2018-01-15', 'checkout' => '2018-02-15' ] )->assertStatus( 401 );
	}

	/** @test */
	public function cleaner_edit_of_booking_should_fail() {
		Passport::actingAs( $this->cleanerTypeUser );
		$this->put( '/api/v1/bookings/1', [ 'guests' => 40, 'beds' => 2, 'checkin' => '2018-01-15', 'checkout' => '2018-02-15' ] )->assertStatus( 401 );
	}
}
