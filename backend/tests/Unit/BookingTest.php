<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BookingTest extends TestCase
{
    /** @test */
    public function booking_has_listing()
    {
        $listing = factory('App\Listing')->create();
        $booking = factory('App\Booking')->create( [ 'listing_id'=>$listing ] );
        
        $this->assertInstanceOf('App\Listing',$booking->listing);
    }

    /** @test */
    public function booking_has_guest()
    {
        $booking = factory('App\Booking')->create();
        
        $this->assertInstanceOf('App\User',$booking->guest);
    }

}
