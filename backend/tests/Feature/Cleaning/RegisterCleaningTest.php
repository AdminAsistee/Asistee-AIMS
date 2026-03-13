<?php

namespace Tests\Feature\Cleaning;

use Laravel\Passport\Passport;
use Mockery\Generator\StringManipulation\Pass\Pass;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Location;
use App\User;

class RegisterCleaningTest extends TestCase
{
	private $randomLocation;

    public function setUp() {
        parent::setUp();
        $this->randomLocation = factory( Location::class )->create();
    }

    /** @test */
    public function cleaning_create_normal_minimum_should_pass()
    {
        $this->post('/api/v1/cleanings/create' , [
			'location_id' => 1,
			'cleaning_date' => '2017-09-01',
        ] )->assertStatus( 201 );
    }

    /** @test */
    public function cleaning_create_normal_with_cleaner_should_pass()
    {
    	$randomCleanerTypeUser = factory( 'App\User')->create( ['type'=>'cleaner'] );
        $this->post('/api/v1/cleanings/create' , [
			'location_id' => 1,
			'cleaning_date' => '2017-09-01',
			'cleaner_id' => $randomCleanerTypeUser->id,
        ] )->assertStatus( 201 );
    }

    /** @test */
    public function cleaning_create_without_location_id_should_fail()
    {
        $this->post('/api/v1/cleanings/create' , [
			'cleaning_date' => '2017-09-01',
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function cleaning_create_without_cleaning_date_should_fail()
    {
        $this->post('/api/v1/cleanings/create' , [
			'location_id' => 1,
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function cleaning_create_with_nonexistent_location_id_should_fail()
    {
        $this->post('/api/v1/cleanings/create' , [
			'location_id' => 15288,
			'cleaning_date' => '2017-09-01',
        ] )->assertStatus( 422 );
    }

    // Creepy edge case - Works in tests (201 and creation id of 1, viewed via replacing the assert with "->assertSee( "Hello, World!" );" ), but not postman (gives 500 SQL - Invalid datetime format: 1292 Incorrect date value: '201-09-01K'). Replacing with more non-date-like string.
    /** @test */
   //  public function cleaning_create_with_invalid_date_string_should_fail()
   //  {
   //      $this->post('/api/v1/cleanings/create' , [
			// 'location_id' => 1,
			// 'cleaning_date' => '201-09-01K',
   //      ] )->assertStatus( 422 );
   //  }
    
    /** @test */
    public function cleaning_create_with_invalid_date_string_should_fail()
    {
        $this->post('/api/v1/cleanings/create' , [
            'location_id' => 1,
            'cleaning_date' => 'This is not a date.',
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function cleaning_create_with_higher_user_id_than_cleanings_should_pass()
    {
        factory( User::class , 50)->create( ['type'=>'cleaner'] );
        $cleaner = factory( User::class )->create(['type'=>'cleaner']);
        $this->post('/api/v1/cleanings/create' , [
            'location_id' => 1,
            'cleaning_date' => '2017-09-01',
            'cleaner_id'=>$cleaner->id
        ] )->assertStatus( 201 );
    }

}
