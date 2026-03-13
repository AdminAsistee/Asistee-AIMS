<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LocationTest extends TestCase
{
	use RefreshDatabase;
    

    /** @test */
    public function location_instance_is_of_correct_type()
    {
    	$location = factory('App\Location')->create();
        $this->assertInstanceOf('App\Location',$location);
    }

    /** @test */
    public function location_has_owner()
    {
        $location = factory('App\Location')->create();
        $this->assertInstanceOf('App\User',$location->owner);
    }

    /** @test */
    public function location_has_listing()
    {
        $listing = factory('App\Listing')->create();
        $location = factory('App\Location')->create();
        $location->listings()->save($listing);
        $this->assertInstanceOf('App\Listing',$location->listings[0]);
    }

    /** @test */
    public function location_has_multiple_listing()
    {
        $location = factory('App\Location')->create();
        $listing = factory('App\Listing', 10)->create()
            ->each(function($l) use ($location) {
                $location->listings()->save($l);
            });
        $this->assertInstanceOf('App\Listing',$location->listings[8]);
    }

    /** @test */
    public function location_has_cleaning()
    {
        $location = factory('App\Location')->create();
        $cleaning = factory('App\Cleaning', 14)->create( [ 'location_id'=>$location ] );
        $this->assertInstanceOf('App\Cleaning',$location->cleanings[0]);
    }

    /** @test */
    public function location_has_multiple_cleanings()
    {
        $location = factory('App\Location')->create();
        $cleaning = factory('App\Cleaning', 14)->create( [ 'location_id'=>$location ] );
        $this->assertInstanceOf('App\Cleaning',$location->cleanings[3]);
    }
}
