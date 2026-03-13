<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Supply;


class SupplyTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function supply_instance_is_of_correct_type()
    {
        $supply = factory('App\Supply')->create();
        
        $this->assertInstanceOf('App\Supply',$supply);
    }
}
