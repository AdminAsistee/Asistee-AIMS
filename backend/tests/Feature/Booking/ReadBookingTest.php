<?php

namespace Tests\Feature\Booking;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Booking;
use Laravel\Passport\Passport;

class ReadBookingTest extends TestCase
{
    public function setUp() {
        parent::setUp();
        $this->firstBooking  = factory( Booking::class )->create();
        $this->secondBooking = factory( Booking::class )->create();
        factory( Booking::class, 2 )->create();
    }
 
	/** @test */
    public function admin_user_can_see_list_of_bookings_data()
    {
        Passport::actingAs( $this->adminTypeUser );
        $this->get('/api/v1/bookings')
            ->assertJsonFragment(['id'=>1])
            ->assertJsonFragment(['id'=>2])
            ->assertJsonFragment(['id'=>3])
            ->assertJsonFragment(['id'=>4])
            ->assertJsonMissing(['id'=>5]);
    }

    /** @test */
    public function admin_user_can_see_list_of_bookings_status()
    {
        Passport::actingAs( $this->adminTypeUser );
        $this->get('/api/v1/bookings')
            ->assertStatus(200);
    }

    /** @test */
    public function admin_user_booking_show_existing_booking_should_pass()
    {
        Passport::actingAs( $this->adminTypeUser );
        $this->get('/api/v1/bookings/1')
            ->assertStatus(200);
    }

    /** @test */
    public function booking_show_existing_booking_has_json_structure()
    {
        Passport::actingAs( $this->adminTypeUser );
        $this->get('/api/v1/bookings/1')
			->assertJsonStructure(['listing_id','checkin','checkout','guests','beds']);
    }

    /** @test */
    public function admin_user_booking_show_nonexisting_booking_should_fail()
    {
        Passport::actingAs( $this->adminTypeUser );
        $this->get('/api/v1/bookings/15000')
            ->assertStatus(422);
    }
}
