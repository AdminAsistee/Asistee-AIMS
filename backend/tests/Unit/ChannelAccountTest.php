<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ChannelAccountTest extends TestCase
{
	/** @test */
    public function channel_account_has_listing()
    {
        $ChannelAccount = factory('App\ChannelAccount')->create();
        $listing = factory('App\Listing')->create( [ 'channel_account_id'=>$ChannelAccount ] );
        $this->assertInstanceOf('App\Listing',$ChannelAccount->listings[0]);
    }

    /** @test */
    public function channel_account_has_multiple_listings()
    {
        $ChannelAccount = factory('App\ChannelAccount')->create();
        $listing = factory('App\Listing', 14)->create( [ 'channel_account_id'=>$ChannelAccount ] );
        $this->assertInstanceOf('App\Listing',$ChannelAccount->listings[4]);
    }
}
