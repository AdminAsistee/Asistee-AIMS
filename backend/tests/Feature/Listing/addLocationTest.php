<?php

namespace Tests\Feature\Listing;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class addLocationTest extends TestCase
{
    // private $random_listing;

    // public function setUp() {
    //     parent::setUp();
    //     $this->random_listing = factory( 'App\Listing' )->create();
    //     $this->random_location = factory( 'App\Location' )->create();
    // }



	/** @test */
    public function listing_add_existing_unassociated_location_request_should_pass()
    {
    	$location = factory( 'App\Location' )->create();
    	$listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/listings/addLocation' , [
            'listing_id'=>1,
            'location_id'=>1,
        ] )->assertStatus( 200 );
    }


    /** @test */
    public function listing_add_existing_associated_location_request_should_fail()
    {
    	$location = factory( 'App\Location' )->create();
    	$listing = factory( 'App\Listing' )->create();
    	$listing->locations()->save($location);
        $this->post('/api/v1/listings/addLocation' , [
            'listing_id'=>1,
            'location_id'=>1,
        ] )->assertStatus( 400 );
    }

    /** @test */
    public function listing_add_nonexisting_location_request_should_fail()
    {
    	$listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/listings/addLocation' , [
            'listing_id'=>1,
            'location_id'=>43215,
        ] )->assertStatus( 400 );
    }

    /** @test */
    public function listing_add_location_with_invalid_listing_should_fail()
    {
    	$listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/listings/addLocation' , [
            'listing_id'=>84217,
            'location_id'=>1,
        ] )->assertStatus( 400 );
    }

}
