<?php

namespace Tests\Feature\Booking;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
// use Tests\Unit\Listing;
use App\Booking;
use App\Listing;
use App\Location;

class RegisterBookingTest extends TestCase
{

	public function setUp() {
        parent::setUp();
        $this->random_location = factory( 'App\Location' )->create();
        $this->random_listing = factory( 'App\Listing' )->create();
        $this->random_listing->locations()->save( $this->random_location );
        // $this->endpoint = '/api/v1/bookings';
        Passport::actingAs( $this->adminTypeUser );
    }


//*************************
//* Authorized User Admin *
//*************************

    /** @test */
    public function admin_user_booking_create_normal_should_pass()
    {
        $this->post('/api/v1/bookings' , [
			'listing_id' => 1,
			'checkin' => '2017-09-01',
			'checkout' => '2017-10-01',
			'guests' => 1,
			'beds' => 1,
        ] )->assertStatus( 201 );
    }


    /** @test */
    public function admin_user_booking_create_normal_without_beds_should_pass()
    {
        $this->post('/api/v1/bookings' , [
			'listing_id' => 1,
			'checkin' => '2017-09-01',
			'checkout' => '2017-10-01',
			'guests' => 1,
        ] )->assertStatus( 201 );
    }

    /** @test */
    public function admin_user_booking_create_without_guests_should_fail()
    {
        $this->post('/api/v1/bookings' , [
			'listing_id' => 1,
			'checkin' => '2017-09-01',
			'checkout' => '2017-10-01',
			'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_without_checkout_should_fail()
    {
        $this->post('/api/v1/bookings' , [
			'listing_id' => 1,
			'checkin' => '2017-09-01',
			'guests' => 1,
			'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_without_checkin_should_fail()
    {
        $this->post('/api/v1/bookings' , [
			'listing_id' => 1,
			'checkout' => '2017-10-01',
			'guests' => 1,
			'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_without_listing_id_should_fail()
    {
        $this->post('/api/v1/bookings' , [
			'checkin' => '2017-09-01',
			'checkout' => '2017-10-01',
			'guests' => 1,
			'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_with_invalid_guest_to_bed_ratio_should_fail()
    {
        $this->post('/api/v1/bookings' , [
        	'listing_id' => 1,
			'checkin' => '2017-09-01',
			'checkout' => '2017-10-01',
			'guests' => 1,
			'beds' => 2,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_with_invalid_checkin_checkout_ratio_should_fail()
    {
        $this->post('/api/v1/bookings' , [
        	'listing_id' => 1,
			'checkin' => '2017-10-05',
			'checkout' => '2017-09-01',
			'guests' => 2,
			'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_with_invalid_checkin_checkout_ratio_edge_case_should_fail()
    {
        $this->post('/api/v1/bookings' , [
        	'listing_id' => 1,
			'checkin' => '2017-10-10',
			'checkout' => '2017-10-09',
			'guests' => 6,
			'beds' => 4,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_with_invalid_checkin_checkout_same_edge_case_should_fail()
    {
        $this->post('/api/v1/bookings' , [
        	'listing_id' => 1,
			'checkin' => '2017-12-25',
			'checkout' => '2017-12-25',
			'guests' => 4,
			'beds' => 3,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_normal_with_nonexistent_listing_id_should_fail()
    {
        $this->post('/api/v1/bookings' , [
        	'listing_id' => 188257,
			'checkin' => '2017-09-01',
			'checkout' => '2017-10-01',
			'guests' => 2,
			'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_user_booking_create_long_should_pass()
    {
        $this->post('/api/v1/bookings' , [
			'listing_id' => 1,
			'checkin' => '2018-04-18',
			'checkout' => '2020-10-07',
			'guests' => 1,
			'beds' => 1,
        ] )->assertStatus( 201 );
    }

    /** @test */
    public function booking_create_overlap_inside_should_fail()
    {
        factory( 'App\Booking' )->create( [
            'listing_id'=>1,
            'checkin' => '2018-04-01',
            'checkout' => '2018-05-01',
        ] );
        $this->post('/api/v1/bookings' , [
            'listing_id' => 1,
            'checkin' => '2018-04-18',
            'checkout' => '2018-04-28',
            'guests' => 1,
            'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function booking_create_overlap_outside_should_fail()
    {
        factory( 'App\Booking' )->create( [
            'listing_id'=>1,
            'checkin' => '2018-04-01',
            'checkout' => '2018-05-01',
        ] );
        $this->post('/api/v1/bookings' , [
            'listing_id' => 1,
            'checkin' => '2018-03-18',
            'checkout' => '2018-05-28',
            'guests' => 1,
            'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function booking_create_overlap_left_should_fail()
    {
        factory( 'App\Booking' )->create( [
            'listing_id'=>1,
            'checkin' => '2018-04-01',
            'checkout' => '2018-05-01',
        ] );
        $this->post('/api/v1/bookings' , [
            'listing_id' => 1,
            'checkin' => '2018-03-18',
            'checkout' => '2018-04-28',
            'guests' => 1,
            'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function booking_create_overlap_right_should_fail()
    {
        factory( 'App\Booking' )->create( [
            'listing_id'=>1,
            'checkin' => '2018-04-01',
            'checkout' => '2018-05-01',
        ] );
        $this->post('/api/v1/bookings' , [
            'listing_id' => 1,
            'checkin' => '2018-04-18',
            'checkout' => '2018-05-28',
            'guests' => 1,
            'beds' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function booking_create_overlap_separate_independent_listings_should_pass()
    {
        factory( 'App\Listing' )->create();
        factory( 'App\Booking' )->create( [
            'listing_id'=>1,
            'checkin' => '2018-04-01',
            'checkout' => '2018-05-01',
        ] );
        $this->post('/api/v1/bookings' , [
            'listing_id' => 2,
            'checkin' => '2018-04-18',
            'checkout' => '2018-05-28',
            'guests' => 1,
            'beds' => 1,
        ] )->assertStatus( 201 );
    }

        /** @test */
    public function admin_cannot_create_booking_overlap_checkout_into_lis_loc_lis_chain() {
        $second_Listing = factory( Listing::class )->create();
        $common_location = factory( Location::class )->create();
        $common_location->listings()->save($this->random_listing);
        $common_location->listings()->save($second_Listing); 
        factory( Booking::class )->create( [
            'listing_id'=>2,
            'checkin'=>'2018-02-05',
            'checkout'=>'2018-03-01',
        ]);
        $this->post( '/api/v1/bookings', [ 
            'listing_id' => 1,
            'checkin' => '2018-01-01',
            'checkout' => '2018-02-13',
            'guests'=>4 ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_cannot_create_booking_overlap_checkout_over_lis_loc_lis_chain() {
        $second_Listing = factory( Listing::class )->create();
        $common_location = factory( Location::class )->create();
        $common_location->listings()->save($this->random_listing);
        $common_location->listings()->save($second_Listing); 
        factory( Booking::class )->create( [
            'listing_id'=>2,
            'checkin'=>'2018-02-05',
            'checkout'=>'2018-03-01',
        ]);
        $this->post( '/api/v1/bookings', [ 
            'listing_id' => 1,
            'checkin' => '2018-01-01',
            'checkout' => '2018-03-13',
            'guests'=>4 ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_cannot_create_booking_overlap_checkin_into_lis_loc_lis_chain() {
        $second_Listing = factory( Listing::class )->create();
        $common_location = factory( Location::class )->create();
        $common_location->listings()->save($this->random_listing);
        $common_location->listings()->save($second_Listing); 
        factory( Booking::class )->create( [
            'listing_id'=>2,
            'checkin'=>'2017-12-15',
            'checkout'=>'2017-12-25',
        ]);
        $this->post( '/api/v1/bookings', [ 
            'listing_id' => 1,
            'checkin' => '2017-12-21',
            'checkout' => '2018-02-01',
            'guests'=>4 ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_cannot_create_booking_overlap_checkin_over_lis_loc_lis_chain() {
        $second_Listing = factory( Listing::class )->create();
        $common_location = factory( Location::class )->create();
        $common_location->listings()->save($this->random_listing);
        $common_location->listings()->save($second_Listing); 
        factory( Booking::class )->create( [
            'listing_id'=>2,
            'checkin'=>'2017-12-15',
            'checkout'=>'2017-12-25',
        ]);
        $this->post( '/api/v1/bookings', [ 
            'listing_id' => 1,
            'checkin' => '2017-11-07',
            'checkout' => '2018-02-01',
            'guests'=>4 ] )->assertStatus( 422 );
    }

    /** @test */
    public function admin_can_create_booking_checkout_and_checkout_over_lis_loc_lis_chain_after() {
        $second_Listing = factory( Listing::class )->create();
        $common_location = factory( Location::class )->create();
        $common_location->listings()->save($this->random_listing);
        $common_location->listings()->save($second_Listing); 
        factory( Booking::class )->create( [
            'listing_id'=>2,
            'checkin'=>'2018-02-05',
            'checkout'=>'2018-03-01',
        ]);
        $this->post( '/api/v1/bookings', [ 
            'listing_id' => 1,
            'checkout' => '2018-03-13', 
            'checkin' => '2018-03-04',
            'guests'=>4 ] )->assertStatus( 201 );
    }

    /** @test */
    public function admin_can_create_booking_checkout_and_checkout_over_lis_loc_lis_chain_before() {
        $second_Listing = factory( Listing::class )->create();
        $common_location = factory( Location::class )->create();
        $common_location->listings()->save($this->random_listing);
        $common_location->listings()->save($second_Listing); 
        factory( Booking::class )->create( [
            'listing_id'=>2,
            'checkin'=>'2017-12-15',
            'checkout'=>'2017-12-25',
        ]);
        $this->post( '/api/v1/bookings', [ 
            'listing_id' => 1,
            'checkin' => '2017-11-07', 
            'checkout' => '2017-11-26',
            'guests'=>4 ] )->assertStatus( 201 );
    }


//**************************
//* Authorized User Client *
//**************************


//*****************************
//* Authorized User Messenger *
//*****************************





//****************************
//* UnAuthorized User Client *
//****************************


//*******************************
//* UnAuthorized User Messenger *
//*******************************


//****************************
//* UnAuthorized User Supervisor *
//****************************


}
