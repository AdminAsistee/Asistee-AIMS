<?php

namespace Tests\Feature\Cleaning;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use App\Location;
use App\User;
use App\Cleaning;

class UpdateCleaningTest extends TestCase
{
    public function setUp() {
        parent::setUp();
        $this->randomLocation = factory( Location::class )->create();
    }

    /** @test */
    public function cleaning_admin_update_cleaner_from_null_to_cleaner_should_pass()
    {
    	$cleaning = factory( Cleaning::class )->create(['cleaner_id'=>null]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
			'cleaner_id' => $this->cleanerTypeUser->id,
        ] )->assertStatus( 202 );
    }

    /** @test */
    public function cleaning_admin_update_cleaner_from_cleaner_to_null_should_pass()
    {
    	$cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
			'remove_cleaner' => 1,
        ] )->assertStatus( 202 );
        $this->assertDatabaseHas('cleanings', ['id'=>$cleaning->id,'cleaner_id'=>null]);
    }

    /** @test */
    public function cleaning_admin_update_cleaner_from_cleaner_to_another_cleaner_should_pass()
    {
    	$another_cleaner = factory( User::class )->create(['type'=>'cleaner']);
    	$cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
			'cleaner_id' => $another_cleaner->id,
        ] )->assertStatus( 202 );
        $this->assertDatabaseHas('cleanings', ['id'=>$cleaning->id,'cleaner_id'=>$another_cleaner->id]);
    }

    /** @test */
    public function cleaning_supervisor_update_cleaner_from_null_to_cleaner_should_pass()
    {
        Passport::actingAs($this->supervisorTypeUser);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>null]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'cleaner_id' => $this->cleanerTypeUser->id,
        ] )->assertStatus( 202 );
    }

    /** @test */
    public function cleaning_supervisor_update_cleaner_from_cleaner_to_null_should_pass()
    {
        Passport::actingAs($this->supervisorTypeUser);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'remove_cleaner' => 1,
        ] )->assertStatus( 202 );
        $this->assertDatabaseHas('cleanings', ['id'=>$cleaning->id,'cleaner_id'=>null]);
    }

    /** @test */
    public function cleaning_supervisor_update_cleaner_from_cleaner_to_another_cleaner_should_pass()
    {
        Passport::actingAs($this->supervisorTypeUser);
        $another_cleaner = factory( User::class )->create(['type'=>'cleaner']);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'cleaner_id' => $another_cleaner->id,
        ] )->assertStatus( 202 );
        $this->assertDatabaseHas('cleanings', ['id'=>$cleaning->id,'cleaner_id'=>$another_cleaner->id]);
    }

    /** @test */
    public function cleaning_client_update_cleaner_from_null_to_cleaner_should_fail()
    {
        Passport::actingAs($this->clientTypeUser);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>null]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'cleaner_id' => $this->cleanerTypeUser->id,
        ] )->assertStatus( 401 );
    }

    /** @test */
    public function cleaning_client_update_cleaner_from_cleaner_to_null_should_fail()
    {
        Passport::actingAs($this->clientTypeUser);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'remove_cleaner' => 1,
        ] )->assertStatus( 401 );
    }

    /** @test */
    public function cleaning_client_update_cleaner_from_cleaner_to_another_cleaner_should_fail()
    {
        Passport::actingAs($this->clientTypeUser);
        $another_cleaner = factory( User::class )->create(['type'=>'cleaner']);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'cleaner_id' => $another_cleaner->id,
        ] )->assertStatus( 401 );
    }

    /** @test */
    public function cleaning_cleaner_update_cleaner_from_null_to_self_should_pass()
    {
        Passport::actingAs($this->cleanerTypeUser);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>null]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'cleaner_id' => $this->cleanerTypeUser->id,
        ] )->assertStatus( 202 );
        $this->assertDatabaseHas('cleanings', ['id'=>$cleaning->id,'cleaner_id'=>$this->cleanerTypeUser->id]);
    }

    /** @test */
    public function cleaning_cleaner_update_cleaner_from_null_to_different_cleaner_should_pass_and_assign_self()
    {
        Passport::actingAs($this->cleanerTypeUser);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>null]);
        $another_cleaner = factory( User::class )->create(['type'=>'cleaner']);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'cleaner_id' => $another_cleaner->id,
        ] )->assertStatus( 202 );
        $this->assertDatabaseHas('cleanings', ['id'=>$cleaning->id,'cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->assertDatabaseMissing('cleanings', ['id'=>$cleaning->id,'cleaner_id'=>$another_cleaner->id]);
    }

    /** @test */
    public function cleaning_cleaner_update_cleaner_from_cleaner_to_null_should_fail()
    {
        Passport::actingAs($this->cleanerTypeUser);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$this->cleanerTypeUser->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'remove_cleaner' => 1,
        ] )->assertStatus( 401 );
        
    }

    /** @test */
    public function cleaning_cleaner_update_anther_assigned_cleaner_user_should_fail()
    {
        Passport::actingAs($this->cleanerTypeUser);
        $another_cleaner = factory( User::class )->create(['type'=>'cleaner']);
        $cleaning = factory( Cleaning::class )->create(['cleaner_id'=>$another_cleaner->id]);
        $this->put('/api/v1/cleanings/'.$cleaning->id , [
            'cleaner_id' => $this->cleanerTypeUser->id,
        ] )->assertStatus( 401 );
    }


}
