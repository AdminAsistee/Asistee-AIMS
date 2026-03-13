<?php

namespace Tests\Feature\SuppliesTransaction;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class CreateSuppliesTransactionTest extends TestCase
{

	public function setUp() {
		parent::setUp();
		Passport::actingAs( $this->adminTypeUser );
	}

    /** @test */
    public function can_create_supply_transaction()
    {
    	$cleaning = factory('App\Cleaning')->create();
    	$supply = factory('App\Supply')->create();
        $this->post( '/api/v1/supplies_transactions', [
			'amount' => 1,
			'supply_id'=>$supply->id,
			'cleaning_id'=>$cleaning->id,
		] )->assertStatus( 201 );
    }
}
