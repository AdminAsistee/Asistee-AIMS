<?php

namespace Tests\Feature\Location;

use Tests\TestCase;
use Laravel\Passport\Passport;
use App\Location;
use App\User;

class addListingTest extends TestCase
{

    public function setUp() {
        parent::setUp();
        $this->clientTypeUser     = factory( User::class )->create( [ 'type' => 'client' ] );
        $this->randomLocation = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
        Passport::actingAs( $this->adminTypeUser );
    }

    // Authorization

    /** @test */
    public function admin_location_add_listing_should_pass()
    {
        $listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/locations/addListing' , [
            'listing_id'=>$listing->id,
            'location_id'=>$this->randomLocation->id,
        ] )->assertStatus( 200 );
    }

    /** @test */
    public function supervisor_location_add_listing_should_pass()
    {
        Passport::actingAs( $this->supervisorTypeUser );
        $listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/locations/addListing' , [
            'listing_id'=>$listing->id,
            'location_id'=>$this->randomLocation->id,
        ] )->assertStatus( 200 );
    }

    /** @test */
    public function location_owner_location_add_listing_should_pass()
    {
        Passport::actingAs( $this->clientTypeUser );
        $listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/locations/addListing' , [
            'listing_id'=>$listing->id,
            'location_id'=>$this->randomLocation->id,
        ] )->assertStatus( 200 );
    }

    /** @test */
    public function location_non_owner_location_add_listing_should_fail()
    {
        $this->not_location_owner_client     = factory( User::class )->create( [ 'type' => 'client' ] );
        Passport::actingAs( $this->not_location_owner_client );

        $listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/locations/addListing' , [
            'listing_id'=>$listing->id,
            'location_id'=>$this->randomLocation->id,
        ] )->assertStatus( 401 );
    }

    // Normal Tests

    /** @test */
    public function location_add_existing_unassociated_listing_request_should_pass()
    {
    	$listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/locations/addListing' , [
            'listing_id'=>$listing->id,
            'location_id'=>$this->randomLocation->id,
        ] )->assertStatus( 200 );
    }


    /** @test */
    public function location_add_existing_associated_listing_request_should_fail()
    {
    	$listing = factory( 'App\Listing' )->create();
    	$this->randomLocation->listings()->save($listing);
        $this->post('/api/v1/locations/addListing' , [
            'listing_id'=>$listing->id,
            'location_id'=>$this->randomLocation->id,
        ] )->assertStatus( 400 );
    }

    /** @test */
    public function location_add_nonexisting_listing_request_should_fail()
    {
    	$location = factory( 'App\Location' )->create();
        $this->post('/api/v1/locations/addListing' , [
        	'listing_id'=>84217,
            'location_id'=>$this->randomLocation->id,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function location_add_listing_with_invalid_location_should_fail()
    {
    	$listing = factory( 'App\Listing' )->create();
        $this->post('/api/v1/locations/addListing' , [
            'listing_id'=>$listing->id,
            'location_id'=>43215,
        ] )->assertStatus( 422 );
    }

}
