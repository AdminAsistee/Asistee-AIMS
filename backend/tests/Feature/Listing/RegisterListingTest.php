<?php

namespace Tests\Feature\Listing;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterListingTest extends TestCase
{
    // private $randomTypeUser, $randomLocation, $randomLocations;

    // public function setUp() {
    //     parent::setUp();
    //     $this->clientTypeUser     = factory( User::class )->create( [ 'type' => 'client' ] );
    //     $this->randomLocation = factory( Location::class )->create(['owner_id'=>$this->clientTypeUser->id]);
    // }

// Location Register Tests

    /** @test */
    public function listing_create_normal_should_pass()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>6,
            'channel_listing_id'=>'58393848',
            'status'=>'newly_created',
        ] )->assertStatus( 201 );
    }

    /** @test */
    public function listing_create_normal_without_status_should_pass()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>2,
            'channel_listing_id'=>'58393848',
        ] )->assertStatus( 201 );
    }

    /** @test */
    public function listing_create_normal_without_channel_listing_id_should_fail()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>1,
            'status'=>'newly_created',
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function listing_create_normal_without_channel_account_id_should_fail()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_listing_id'=>'58393848',
            'status'=>'newly_created',
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function listing_create_with_zero_channel_listing_id_should_fail()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>0,
            'channel_listing_id'=>'58393848',
            'status'=>'newly_created',
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function listing_create_with_negative_channel_listing_id_should_fail()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>-14,
            'channel_listing_id'=>'58393848',
            'status'=>'newly_created',
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function listing_create_with_super_long_channel_listing_id_should_pass()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>19,
            'channel_listing_id'=>'5839383487394853095347875209830957430523849328059345239043282385748367342904809750235943289248',
            'status'=>'newly_created',
        ] )->assertStatus( 201 );
    }

    /** @test */
    public function listing_create_with_empty_channel_listing_id_should_fail()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>12,
            'channel_listing_id'=>'',
            'status'=>'newly_created',
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function listing_create_with_invalid_status_should_fail()
    {
        $this->post('/api/v1/listings/create' , [
            'channel_account_id'=>1,
            'channel_listing_id'=>'58393848',
            'status'=>'newli_created',
        ] )->assertStatus( 422 );
    }

}
