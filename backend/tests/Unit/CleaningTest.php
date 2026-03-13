<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CleaningTest extends TestCase
{
    /** @test */
    public function cleaning_has_location()
    {
        $location = factory('App\Location')->create();
        $cleaning = factory('App\Cleaning')->create( [ 'location_id'=>$location ] );
        
        $this->assertInstanceOf('App\Location',$cleaning->location);
    }

    /** @test */
    public function cleaning_has_cleaner()
    {
        $user = factory('App\User')->create();
        $cleaning = factory('App\Cleaning')->create( [ 'cleaner_id'=>$user ] );
        
        $this->assertInstanceOf('App\User',$cleaning->cleaner);
    }
}
