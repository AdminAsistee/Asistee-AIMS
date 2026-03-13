<?php

namespace Tests\Feature\Location;

use App\User;
use App\Location;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ReadLocationTest extends TestCase
{

    protected $randomLocation, $randomLocations;

    public function setUp() {
        parent::setUp();
        $this->clientTypeUser     = factory( User::class )->create( [ 'type' => 'client' ] );
        $this->randomLocation = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
        Passport::actingAs( $this->adminTypeUser );
    }


    /** @test */
    public function locations_auth_client_owner_should_see_info()
    {
        Passport::actingAs( $this->clientTypeUser );
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertStatus(200);
    }

    /** @test */
    public function locations_auth_client_not_owner_should_not_see_info()
    {
        $not_client_owner = factory( User::class )->create( [ 'type' => 'client' ] );
        Passport::actingAs( $not_client_owner );
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertStatus( 401);
    }

    /** @test */
    public function locations_auth_cleaner_should_see_info()
    {
        $normal_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        Passport::actingAs( $normal_cleaner );
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertStatus( 200);
    }

    /** @test */
    public function locations_auth_admin_should_see_info()
    {
        $admin = factory( User::class )->create( [ 'type' => 'administrator' ] );
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertStatus( 200);
    }

    /** @test */
    public function locations_auth_supervisor_should_see_info()
    {
        $supervisor = factory( User::class )->create( [ 'type' => 'supervisor' ] );
        Passport::actingAs( $supervisor );
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertStatus( 200);
    }


// Locations Attributes Existence Test


    /** @test */
    public function locations_index_attribute_id()
    {
        $this->get('/api/v1/locations')
            ->assertSeeText((string)$this->randomLocation->id);
    }
    /** @test */
    public function locations_index_attribute_building_name()
    {
        $this->get('/api/v1/locations')
            ->assertSeeText((string)$this->randomLocation->building_name);
    }
    /** @test */
    public function locations_index_attribute_room_number()
    {
        $this->get('/api/v1/locations')
            ->assertSeeText((string)$this->randomLocation->room_number);
    }
    /** @test */
    public function locations_index_attribute_address()
    {
        $location = factory('App\Location')->create();
        $response = $this->get('/api/v1/locations');
        $nl = preg_replace("/[\n\r]/","\\n",$this->randomLocation->address);
        $response->assertSeeText($nl);
    }
    /** @test */
    public function locations_index_attribute_latitude()
    {
        $this->get('/api/v1/locations')
            ->assertSeeText((string)$this->randomLocation->latitude);
    }
    /** @test */
    public function locations_index_attribute_longitude()
    {
        $this->get('/api/v1/locations')
            ->assertSeeText((string)$this->randomLocation->longitude);
    }
    /** @test */
    public function locations_index_attribute_status()
    {
        $this->get('/api/v1/locations')
            ->assertSeeText((string)$this->randomLocation->status);
    }

/** @test */
    public function locations_index_shows_near_end()
    {
        $this->randomLocations = factory( Location::class , 20 )->create();
        $response = $this->get('/api/v1/locations');

        $response->assertSeeText((string)$this->randomLocations[18]->id);
    }

/** @test */
    public function locations_index_shows_first()
    {
        $this->randomLocations = factory( Location::class , 20 )->create();
        $response = $this->get('/api/v1/locations');

        $response->assertSeeText((string)$this->randomLocations[1]->id);
    }
    /** @test */
    public function locations_index_shows_end()
    {
        $this->randomLocations = factory( Location::class , 20 )->create();
        $response = $this->get('/api/v1/locations');

        $response->assertSeeText((string)$this->randomLocations[19]->id);
    }



///////// Duplicately made

        /** @test */
    public function locations_index_admin_should_pass()
    {
        $this->get('/api/v1/locations')
            ->assertStatus( 200 );
    }

    /** @test */
    public function locations_index_supervisor_should_pass()
    {
        Passport::actingAs( $this->supervisorTypeUser );
        $this->get('/api/v1/locations')
            ->assertStatus( 200 );
    }

    /** @test */
    public function locations_index_cleaner_should_pass()
    {
        Passport::actingAs( $this->cleanerTypeUser );
        $this->get('/api/v1/locations')
            ->assertStatus( 200 );
    }

    /** @test */
    public function locations_index_client_should_pass()
    {
        Passport::actingAs( $this->clientTypeUser );
        $this->get('/api/v1/locations')
            ->assertStatus( 200 );
    }

    /** @test */
    public function locations_index_should_show_all_locations()
    {
        $location2 = factory( Location::class )->create();
        $location3 = factory( Location::class )->create();
        $location4 = factory( Location::class )->create();
        $location5 = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
        $this->get('/api/v1/locations')
            ->assertJsonFragment([ 'id' => 1])
            ->assertJsonFragment([ 'id' => 2])
            ->assertJsonFragment([ 'id' => 3])
            ->assertJsonFragment([ 'id' => 4])
            ->assertJsonFragment([ 'id' => 5])
            ->assertJsonMissing([ 'id' => 6]);
    }

    /** @test */
    public function locations_index_client_should_show_all_clients_locations()
    {
        Passport::actingAs( $this->clientTypeUser );
        $non_owner_client     = factory( User::class )->create( [ 'type' => 'client' ] );
        $location2 = factory( Location::class )->create(['owner_id'=>$non_owner_client->id]);
        $location3 = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);

        $this->get('/api/v1/locations')
            ->assertJsonFragment([ 'id' => 1])
            ->assertJsonFragment([ 'id' => 3])
            ->assertJsonMissing([ 'id' => 2]);
    }








// Location Show Attributes Test

/** @test */
    public function locations_show_attribute_id()
    {
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertSeeText((string)$this->randomLocation->id);
    }
    /** @test */
    public function locations_show_attribute_building_name()
    {
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertSeeText((string)$this->randomLocation->building_name);
    }
    /** @test */
    public function locations_show_attribute_room_number()
    {
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertSeeText((string)$this->randomLocation->room_number);
    }
    /** @test */
    public function locations_show_attribute_address()
    {
        $response = $this->get('/api/v1/locations/1');
        $nl = preg_replace("/[\n\r]/","\\n",$this->randomLocation->address);
        $response->assertSeeText($nl);
    }
    /** @test */
    public function locations_show_attribute_latitude()
    {
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertSeeText((string)$this->randomLocation->latitude);
    }
    /** @test */
    public function locations_show_attribute_longitude()
    {
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertSeeText((string)$this->randomLocation->longitude);
    }
    /** @test */
    public function locations_show_attribute_status()
    {
        $this->get('/api/v1/locations/'.$this->randomLocation->id)
            ->assertSeeText((string)$this->randomLocation->status);
    }
    /** @test */
    public function locations_show_shows_target()
    {
        $this->randomLocations = factory( Location::class , 11 )->create();
        factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
        $this->randomLocations = factory( Location::class , 7 )->create();
        $response = $this->get('/api/v1/locations/13');

        $response->assertJson([ 'id' => 13]);
    }
    /** @test */
    public function locations_show_not_multiple()
    {
        $this->randomLocations = factory( Location::class , 20 )->create();
        $response = $this->get('/api/v1/locations/4');

        $response->assertJsonMissing([ 'id' => 10]);
    }
    /** disabled as location now loads with owner so this may trigger an error when the owner id is less than 21 */
//    public function locations_show_length_1()
//    {
//        $this->randomLocations = factory( Location::class , 20 )->create();
//        $response = $this->get('/api/v1/locations/4');
//
//        $response->assertJsonMissing(['id'=>1])
//            ->assertJsonMissing(['id'=>2])
//            ->assertJsonMissing(['id'=>3])
//            ->assertJsonMissing(['id'=>5])
//            ->assertJsonMissing(['id'=>6])
//            ->assertJsonMissing(['id'=>7])
//            ->assertJsonMissing(['id'=>8])
//            ->assertJsonMissing(['id'=>9])
//            ->assertJsonMissing(['id'=>10])
//            ->assertJsonMissing(['id'=>11])
//            ->assertJsonMissing(['id'=>12])
//            ->assertJsonMissing(['id'=>13])
//            ->assertJsonMissing(['id'=>14])
//            ->assertJsonMissing(['id'=>15])
//            ->assertJsonMissing(['id'=>16])
//            ->assertJsonMissing(['id'=>17])
//            ->assertJsonMissing(['id'=>18])
//            ->assertJsonMissing(['id'=>19])
//            ->assertJsonMissing(['id'=>20]);
//    }




// Relational Tests

    /** @test */
    // public function a_client_can_see_their_own_properties()
    // {
    //     Passport::actingAs( $this->clientTypeUser );
    //     $this->get('/api/v1/locations')
    //         ->assertSeeText((string)$this->randomLocation->id);
    // }
}
