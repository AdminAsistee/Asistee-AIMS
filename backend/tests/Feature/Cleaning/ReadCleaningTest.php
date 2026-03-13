<?php

namespace Tests\Feature\Cleaning;

use Laravel\Passport\Passport;
use Tests\TestCase;
use App\User;
use App\Location;
use App\Cleaning;
use Illuminate\Foundation\Testing\RefreshDatabase;
 
class ReadCleaningTest extends TestCase
{


    public function setUp() {
        parent::setUp();
        $this->randomLocation = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
        Passport::actingAs( $this->adminTypeUser );
    }


// AUTH TESTS

    /** @test */
    public function cleanings_auth_client_should_see_owned_cleanings_info_and_not_anothers_index()
    {
        Passport::actingAs( $this->clientTypeUser );
        $not_client_owner = factory( User::class )->create( [ 'type' => 'client' ] );
        $not_client_location = factory( Location::class )->create(['owner_id'=>$not_client_owner->id]);
        factory( Cleaning::class,20)->create(['location_id'=>$not_client_location->id,'cleaner_id'=>$this->cleanerTypeUser]);
        factory( Cleaning::class,20)->create(['location_id'=>$this->randomLocation->id,'cleaner_id'=>$this->cleanerTypeUser]);
        $cleaning = factory( Cleaning::class)->create(['location_id'=>$not_client_location->id,'cleaner_id'=>$this->cleanerTypeUser]);
        $this->get('/api/v1/cleanings')
            ->assertStatus(200)
            ->assertJsonMissing(['id'=>11])
            ->assertJsonMissing(['id'=>15])
            ->assertJsonMissing(['id'=>16])
            ->assertJsonFragment(['id'=>23])
            ->assertJsonFragment(['id'=>28])
            ->assertJsonFragment(['id'=>36])
            ->assertJsonMissing(['id'=>$cleaning->id]);
        Passport::actingAs( $not_client_owner );
        $this->get('/api/v1/cleanings')
            ->assertStatus(200)
            ->assertJsonMissing(['id'=>24])
            ->assertJsonMissing(['id'=>25])
            ->assertJsonMissing(['id'=>26])
            ->assertJsonFragment(['id'=>18])
            ->assertJsonFragment(['id'=>12])
            ->assertJsonFragment(['id'=>3])
            ->assertJsonFragment(['id'=>$cleaning->id]);
            
    }
    /** @test */
    public function cleanings_auth_client_should_see_owned_cleanings_info_single()
    {
        Passport::actingAs( $this->clientTypeUser );
        $another_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        factory( Cleaning::class,3)->create(['location_id'=>1,'cleaner_id'=>$another_cleaner]);
        factory( Cleaning::class,3)->create(['location_id'=>$this->randomLocation->id,]);
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser,'location_id'=>$this->randomLocation->id]);
        $this->get('/api/v1/cleanings/'.$cleaning->id)
            ->assertStatus(200)
            ->assertJsonFragment(['id'=>$cleaning->id]);
    }
    /** @test */
    public function cleanings_auth_client_should_not_see_another_clients_cleanings()
    {
        Passport::actingAs( $this->clientTypeUser );
        $another_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        factory( Cleaning::class,3)->create(['cleaner_id'=>$another_cleaner]);
        factory( Cleaning::class,3)->create();
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser,'location_id'=>$this->randomLocation->id]);
        $this->get('/api/v1/cleanings/2')
            ->assertStatus(401);
    }

    ///////////////////////////////////////

    /** @test */
    public function cleanings_auth_cleaner_should_see_assigned_cleanings_info_and_not_anothers_index()
    {
        Passport::actingAs( $this->cleanerTypeUser );
        $another_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        factory( Cleaning::class,10)->create(['location_id'=>1,'cleaner_id'=>1]);
        factory( Cleaning::class,3)->create(['location_id'=>$this->randomLocation->id,'cleaner_id'=>$another_cleaner]);
        factory( Cleaning::class,3)->create(['cleaner_id'=>null]);
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser]);
        $this->get('/api/v1/cleanings')
            ->assertStatus(200)
            ->assertJsonFragment(['id'=>$cleaning->id])
            ->assertJsonMissing(['id'=>12]);
    }

    /** @test */
    public function cleanings_auth_cleaner_should_see_assigned_cleanings_info_single()
    {
        Passport::actingAs( $this->cleanerTypeUser );
        $another_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        factory( Cleaning::class,10)->create(['location_id'=>1,'cleaner_id'=>1]);
        factory( Cleaning::class,3)->create(['cleaner_id'=>$another_cleaner]);
        factory( Cleaning::class,3)->create();
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser]);
        $this->get('/api/v1/cleanings/'.$cleaning->id)
            ->assertStatus(200)
            ->assertJsonFragment(['id'=>$cleaning->id]);
    }
    /** @test */
    public function cleanings_auth_cleaner_should_not_see_another_cleaners_assigned_cleanings()
    {
        Passport::actingAs( $this->cleanerTypeUser );
        $another_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        factory( Cleaning::class,3)->create(['cleaner_id'=>$another_cleaner]);
        factory( Cleaning::class,3)->create();
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser]);
        $this->get('/api/v1/cleanings/2')
            ->assertStatus(401);
    }

    /** @test */
    public function cleanings_auth_cleaner_should_see_unassigned_cleanings_info_index()
    {
        Passport::actingAs( $this->cleanerTypeUser );
        factory( Cleaning::class ,10)->create();
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>null]);
        $this->get('/api/v1/cleanings?unassigned=1')
            ->assertStatus( 200)
            ->assertJsonFragment(['id'=>$cleaning->id]);
    }
    /** @test */
    public function cleanings_auth_cleaner_should_see_unassigned_cleanings_info_single()
    {
        Passport::actingAs( $this->cleanerTypeUser );
        factory( Cleaning::class ,10)->create();
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>null]);
        $this->get('/api/v1/cleanings/'.$cleaning->id)
            ->assertStatus( 200)
            ->assertJsonFragment(['id'=>$cleaning->id]);
    }

    // /** @test */
    // public function cleanings_auth_cleaner_should_not_see_another_cleaners_assigned_cleanings_info()
    // {
    //     $this->markTestIncomplete('For now cleaners can see more than they should.');
    //     $normal_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
    //     Passport::actingAs( $normal_cleaner );
    //     $this->get('/api/v1/locations/'.$this->randomLocation->id)
    //         ->assertStatus( 200);
    // }

    /** @test */
    public function cleanings_auth_admin_should_see_info()
    {
        $another_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        $not_client_owner = factory( User::class )->create( [ 'type' => 'client' ] );
        $not_client_location = factory( Location::class )->create(['owner_id'=>$not_client_owner->id]);
        factory( Cleaning::class)->create(['cleaner_id'=>$another_cleaner,'location_id'=>$not_client_location->id]);
        factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser,'location_id'=>$not_client_location->id]);
        factory( Cleaning::class)->create(['cleaner_id'=>$another_cleaner,'location_id'=>$this->randomLocation->id]);
        factory( Cleaning::class,3)->create();
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser,'location_id'=>$this->randomLocation->id]);
        $this->get('/api/v1/cleanings')
            ->assertStatus(200)
            ->assertJsonFragment(['id'=>1])
            ->assertJsonFragment(['id'=>2])
            ->assertJsonFragment(['id'=>3])
            ->assertJsonFragment(['id'=>4])
            ->assertJsonFragment(['id'=>5])
            ->assertJsonFragment(['id'=>6])
            ->assertJsonFragment(['id'=>7]);
    }


    /** @test */
    public function cleanings_auth_supervisor_should_see_info()
    {
        Passport::actingAs( $this->supervisorTypeUser );
        $another_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        $not_client_owner = factory( User::class )->create( [ 'type' => 'client' ] );
        $not_client_location = factory( Location::class )->create(['owner_id'=>$not_client_owner->id]);
        factory( Cleaning::class)->create(['cleaner_id'=>$another_cleaner,'location_id'=>$not_client_location->id]);
        factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser,'location_id'=>$not_client_location->id]);
        factory( Cleaning::class)->create(['cleaner_id'=>$another_cleaner,'location_id'=>$this->randomLocation->id]);
        factory( Cleaning::class,3)->create();
        $cleaning = factory( Cleaning::class)->create(['cleaner_id'=>$this->cleanerTypeUser,'location_id'=>$this->randomLocation->id]);
        $this->get('/api/v1/cleanings')
            ->assertStatus(200)
            ->assertJsonFragment(['id'=>1])
            ->assertJsonFragment(['id'=>2])
            ->assertJsonFragment(['id'=>3])
            ->assertJsonFragment(['id'=>4])
            ->assertJsonFragment(['id'=>5])
            ->assertJsonFragment(['id'=>6])
            ->assertJsonFragment(['id'=>7]);
    }





// NORMAL TESTS

	/** @test */
    public function cleaning_index_attribute_id()
    {
	    Passport::actingAs( $this->adminTypeUser );
        $randomCleaning = factory( 'App\Cleaning' , 4)->create();
        $this->get('/api/v1/cleanings')
            ->assertJsonFragment(['id'=>1])
            ->assertJsonFragment(['id'=>2])
            ->assertJsonFragment(['id'=>3])
            ->assertJsonFragment(['id'=>4]);
    }

    /** @test */
    public function cleaning_show_existing_cleaning_should_pass()
    {
	    Passport::actingAs( $this->adminTypeUser );
        $randomCleaning = factory( 'App\Cleaning')->create();
        $this->get('/api/v1/cleanings/1')
            ->assertStatus(200);
    }

    /** @test */
    public function cleaning_show_nonexisting_cleaning_should_fail()
    {
	    Passport::actingAs( $this->adminTypeUser );
        $randomCleaning = factory( 'App\Cleaning')->create();
        $this->get('/api/v1/cleanings/15000')
            ->assertStatus(422);
    }

    /** @test */
    public function cleaning_show_existing_cleaning_has_json_structure()
    {
	    Passport::actingAs( $this->adminTypeUser );
        $randomCleaning = factory( 'App\Cleaning')->create();
        $this->get('/api/v1/cleanings/1')
			->assertJsonStructure(['location_id','cleaning_date','cleaner_id','status','staff_payout_price_id','client_charge_price_id','note_id','start_time','end_time']);
    }
}
