<?php

namespace Tests\Feature\Listing;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReadListingTest extends TestCase
{
    // private $randomTypeUser, $randomLocation, $randomLocations;

    // public function setUp() {
    //     parent::setUp();
    //     $this->clientTypeUser     = factory( User::class )->create( [ 'type' => 'client' ] );
    //     $this->randomLocation = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
    // }

// Locations Attributes Existence Test

    /** @test */
    public function listings_index_attribute_id()
    {
        // Passport::actingAs( $this->randomTypeUser );
        $randomListing = factory( 'App\Listing' )->create();
        $this->get('/api/v1/listings')
            ->assertSeeText((string)$randomListing->id);
    }

    /** @test */
    public function listings_show()
    {
        // Passport::actingAs( $this->randomTypeUser );
        $randomListing = factory( 'App\Listing' , 27)->create();
        $this->get('/api/v1/listings/21')
            ->assertJsonFragment([ 'id' => 21])
            ->assertJsonMissing([ 'id' => 14]);
    }
}
