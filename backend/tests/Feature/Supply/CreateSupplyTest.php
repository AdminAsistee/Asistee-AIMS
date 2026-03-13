<?php

namespace Tests\Feature\Supply;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class CreateSupplyTest extends TestCase
{

	public function setUp() {
		parent::setUp();
		Passport::actingAs( $this->adminTypeUser );
	}

    /** @test */
    public function can_create_supply()
    {
        $this->post( '/api/v1/supplies', [
			'name' => 'ScrubberDubber',
			'ready_stock'=>20,
			'in_use_stock'=>60,
			'in_maintenance_stock'=>15,
		] )->assertStatus( 201 );
    }

}
