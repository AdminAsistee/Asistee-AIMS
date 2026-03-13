<?php

namespace Tests\Feature\Channel;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class drawListingBookingInfoTest extends TestCase
{
    public function setUp() {
        parent::setUp();
        Passport::actingAs( $this->adminTypeUser );
    }
	/** @test */
    public function decryption_success_should_send_success_response()
    {
    	$original_word = 'this_is_a_secret_token_string';
    	$location = factory( 'App\ChannelAccount' )->create( ['channel_id'=>1,
    		'authentication_token'=>encrypt($original_word)] );
    	$listing = factory( 'App\Listing' )->create(
    		['channel_account_id'=>1]);
        $this->get( '/api/v1/channel/1?date1=2018-01-01&date2=2018-02-01' )->assertStatus( 200 );
    }

    /** @test */
    public function decryption_fail_should_send_error_response()
    {
    	$original_word = 'this_is_a_secret_token_string';
    	$location = factory( 'App\ChannelAccount' )->create( ['channel_id'=>1,
    		'authentication_token'=>$original_word] );
    	$listing = factory( 'App\Listing' )->create(
    		['channel_account_id'=>1]);
        $this->get( '/api/v1/channel/1?date1=2018-01-01&date2=2018-02-01' )->assertStatus( 512 );
    }
}
