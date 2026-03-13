<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;
use App\Location;

class UserTest extends TestCase
{

	public function setUp() {
        parent::setUp();
        $this->clientTypeUser = factory( User::class )->create( [ 'type' => 'client' ] );
        $this->randomLocation = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
    }


    /** @test */
    public function client_has_location()
    {
        $this->assertInstanceOf(Location::class,$this->clientTypeUser->locations[0]);
    }

    /** @test */
    public function client_has_multiple_locations()
    {
    	factory( Location::class , 5)->create(['owner_id'=>$this->clientTypeUser->id]);
        $this->assertInstanceOf(Location::class,$this->clientTypeUser->locations[5]);
    }
}
