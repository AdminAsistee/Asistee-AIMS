<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\SuppliesTransaction;

class SuppliesTransactionTest extends TestCase
{
    /** @test */
    public function SuppliesTransaction_instance_is_of_correct_type()
    {
    	$supplies_transaction = factory('App\SuppliesTransaction')->create();
        $this->assertInstanceOf('App\SuppliesTransaction',$supplies_transaction);
    }

    /** @test */
    public function SuppliesTransaction_cleaning_instance_is_of_correct_type()
    {
    	$supplies_transaction = factory('App\SuppliesTransaction')->create();
        $this->assertInstanceOf('App\Cleaning',$supplies_transaction->cleaning);
    }

    /** @test */
    public function SuppliesTransaction_supply_instance_is_of_correct_type()
    {
    	$supplies_transaction = factory('App\SuppliesTransaction')->create();
        $this->assertInstanceOf('App\Supply',$supplies_transaction->supply);
    }
}
