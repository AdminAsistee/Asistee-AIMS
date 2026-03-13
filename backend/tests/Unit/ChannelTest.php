<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Channels\ChannelAbstract;

// This test class bleeds into the static Channel Objects as well, testing the Channel Objects which implements app/Channels/ChannelInterface.
// This is in addition to laravel Channel Model unit testing

class ChannelTest extends TestCase
{
    /** @test */
    public function airbnb_channel_opject_can_be_instantiated()
    {
        $airbnb = ChannelAbstract::getChannelObject(1);
        $this->assertInstanceOf('App\Channels\Airbnb',$airbnb);
    }
}
