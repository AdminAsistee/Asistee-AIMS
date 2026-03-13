<?php

namespace Tests\Feature\Supply;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use App\Supply;

class UpdateSupplyTest extends TestCase
{
    public function setUp() {
		parent::setUp();
		Passport::actingAs( $this->adminTypeUser );
	}

	/** @test */
    public function can_update_supply()
    {
    	$supply = factory(Supply::class)->create([
    		'name' => 'Boring Supply 1',
    		// 'price_id'=>factory('App\Price')->create(),
			'ready_stock'=>6,
			'in_use_stock'=>3,
			'in_maintenance_stock'=>0,
    	]);
    	
        $this->put( '/api/v1/supplies/'.$supply->id, [
			'name' => 'New Supply 4000',
			'ready_stock'=>4000,
			'in_use_stock'=>9999,
			'in_maintenance_stock'=>9999,
		] )->assertStatus( 202 );
    }

    /** @test */
    public function can_buy_supply()
    {
    	$supply = factory(Supply::class)->create([
    		'name' => 'Boring Supply 1',
    		// 'price_id'=>factory('App\Price')->create(),
			'ready_stock'=>10,
			'in_use_stock'=>3,
			'in_maintenance_stock'=>0,
    	]);
    	
        $this->put( '/api/v1/supplies/'.$supply->id . '/buy?amount=30' )->assertStatus( 202 );
    }

    /** @test */
    public function can_use_supply()
    {
    	$supply = factory(Supply::class)->create([
    		'name' => 'Boring Supply 1',
    		// 'price_id'=>factory('App\Price')->create(),
			'ready_stock'=>26,
			'in_use_stock'=>4,
			'in_maintenance_stock'=>0,
    	]);
    	
        $this->put( '/api/v1/supplies/'.$supply->id . '/use?amount=5' )->assertStatus( 202 );
    }
}
