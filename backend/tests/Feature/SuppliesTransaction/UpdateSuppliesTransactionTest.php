<?php

namespace Tests\Feature\SuppliesTransaction;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use App\SuppliesTransaction;

class UpdateSuppliesTransactionTest extends TestCase
{
    public function setUp() {
		parent::setUp();
		Passport::actingAs( $this->adminTypeUser );
	}

	/** @test */
    public function can_update_supplies_transaction()
    {
    	$supplies_transaction = factory(SuppliesTransaction::class)->create([
    		'supply_id' => factory('App\Supply')->create(),
    		'amount'=>1,
			'cleaning_id'=>factory('App\Cleaning')->create(),
			'status'=>"not_fulfilled",
    	]);
    	
        $this->put( '/api/v1/supplies_transactions/'.$supplies_transaction->id, [
			'amount'=>40,
			'status'=>"staged",
		] )->assertStatus( 202 );
    }

    /** @test */
    public function can_fulfil_supplies_transaction()
    {
        $supplies_transaction = factory(SuppliesTransaction::class)->create([
            'supply_id' => factory('App\Supply')->create(),
            'amount'=>1,
            'cleaning_id'=>factory('App\Cleaning')->create(),
            'status'=>"not_fulfilled",
        ]);
        
        $this->put( '/api/v1/supplies_transactions/'.$supplies_transaction->id . '/fulfill')->assertStatus( 202 );
    }

    /** @test */
    public function can_deliver_supplies_transaction()
    {
        $supplies_transaction = factory(SuppliesTransaction::class)->create([
            'supply_id' => factory('App\Supply')->create(),
            'amount'=>1,
            'cleaning_id'=>factory('App\Cleaning')->create(),
            'status'=>"not_fulfilled",
        ]);
        
        $this->put( '/api/v1/supplies_transactions/'.$supplies_transaction->id . '/deliver')->assertStatus( 202 );
    }
}