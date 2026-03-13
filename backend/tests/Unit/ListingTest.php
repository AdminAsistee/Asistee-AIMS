<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
// use App\Location;

class Listing extends TestCase
{
    // use RefreshDatabase;
	// public function setUp() {
 //        parent::setUp();
 //        // $this->clientTypeUser = factory( User::class )->create( [ 'type' => 'client' ] );
 //        // $this->randomLocation = factory( Location::class )->create();
 //        // $this->randomlisting = factory( Listing::class )->create();

 //        $this->randomlisting = factory(App\Listing::class)->create()->each(function($l) {
 //        	$l->locations()->save(factory(App\Location::class)->make());
 //    	});

 //        // $this->randomlisting = factory(App\Listing::class)->create()->locations()->save(factory(App\Location::class)->create());
 //    }


    /** @test */
    public function listing_has_location()
    {

        $location = factory('App\Location')->create();
        $listing = factory('App\Listing')->create();
        $listing->locations()->save($location);
        $this->assertInstanceOf('App\Location',$listing->locations[0]);

        // $randomlisting = factory(App\Listing::class)->create()->each(function($l) {
        //     // $l->locations()->save(factory(App\Location::class)->make());
        // });
        // $this->assertInstanceOf(Location::class,$randomlisting->locations[0]);
    }

    /** @test */
    public function listing_has_multiple_locations()
    {
        $listing = factory('App\Listing')->create();
        $location = factory('App\Location', 10)->create()
            ->each(function($l) use ($listing) {
                $listing->locations()->save($l);
            });
        $this->assertInstanceOf('App\Location',$listing->locations[8]);
    }

    /** @test */
    public function listing_has_booking()
    {
        $listing = factory('App\Listing')->create();
        $booking = factory('App\Booking')->create( [ 'listing_id'=>$listing ] );
        
        $this->assertInstanceOf('App\Booking',$listing->bookings[0]);
    }

    /** @test */
    public function listing_has_multiple_bookings()
    {
        $listing = factory('App\Listing')->create();
        $booking = factory('App\Booking', 10)->create( [ 'listing_id'=>$listing ] );
        $this->assertInstanceOf('App\Booking',$listing->bookings[8]);
    }

    /** @test */
    public function listing_has_channel_account()
    {
        $ChannelAccount = factory('App\ChannelAccount')->create();
        $listing = factory('App\Listing')->create( [ 'channel_account_id'=>$ChannelAccount ] );
        $this->assertInstanceOf('App\ChannelAccount',$listing->channel_account);
    }
}
