<?php

namespace Tests\Feature\Location;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Location;
use App\Listing;
use App\User;
use Laravel\Passport\Passport;

class ViewListingsTest extends TestCase
{
    public function setUp() {
        parent::setUp();
        $this->clientTypeUser     = factory( User::class )->create( [ 'type' => 'client' ] );
        $this->randomLocation = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]); // 1
        $this->randomListing = factory( Listing::class )->create(); // 1
        $this->randomListing->locations()->save($this->randomLocation); // 1-1
        Passport::actingAs( $this->adminTypeUser );
    }

    /** @test */
    public function locations_listings_that_does_not_exist_should_fail()
    {
        $this->get('/api/v1/locations/84391/listings')
            ->assertStatus( 422 );
    }

    /** @test */
    public function locations_listings_with_no_listings_should_pass()
    {
        $this->get('/api/v1/locations/1/listings')
            ->assertStatus( 200 );
    }

    /** @test */
    public function locations_listings_with_no_listings_should_return_empty()
    {
    	factory( Location::class )->create(); // 2
        $this->get('/api/v1/locations/2/listings')
        	->assertSeeText('[]');
    }

    /** @test */
    public function locations_listings_with_one_associted_listing_should_pass()
    {
        $this->get('/api/v1/locations/1/listings')
            ->assertStatus( 200 );
    }

    /** @test */
    public function locations_listings_with_three_associted_listings_should_pass()
    {
    	$listing2 = factory( Listing::class )->create(); // 2
    	$listing3 = factory( Listing::class )->create(); // 3
    	$this->randomLocation->listings()->save($listing2);
    	$this->randomLocation->listings()->save($listing3);
        $this->get('/api/v1/locations/1/listings')
            ->assertStatus( 200 );
    }

    /** @test */
    public function locations_listings_with_one_associted_listing_should_show_all_listings()
    {
        $this->get('/api/v1/locations/1/listings')
            ->assertJsonFragment([ 'id' => 1]);
    }

    /** @test */
    public function locations_listings_with_three_associted_listings_should_show_all_listings()
    {
    	$listing2 = factory( Listing::class )->create(); // 2
    	$listing3 = factory( Listing::class )->create(); // 3
    	$this->randomLocation->listings()->save($listing2);
    	$this->randomLocation->listings()->save($listing3);
        $this->get('/api/v1/locations/1/listings')
            ->assertJsonFragment([ 'id' => 1])
            ->assertJsonFragment([ 'id' => 2])
            ->assertJsonFragment([ 'id' => 3])
            ->assertJsonMissing(['id'=>4]);
    }
}
