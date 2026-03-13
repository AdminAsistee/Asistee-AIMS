<?php

namespace Tests\Feature\Price;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Price;
 
class CreatePriceTest extends TestCase
{
    /** @test */
    public function price_create_normal_minimal_should_pass()
    {
        $this->post('/api/v1/prices/create' , ['description'=>'This is a basic price','total'=>66224] )->assertStatus( 201 );
    }

    /** @test */
    public function price_create_normal_minimal_malformed_key_should_pass()
    {
        $this->post('/api/v1/prices/create' , ['description'=>'This is a basic price','totasal'=>66224] )->assertStatus( 422 );
    }

    /** @test */
    public function price_create_normal_minimal_malformed_value_should_pass()
    {
        $this->post('/api/v1/prices/create' , ['amount'=>'this is not a number'] )->assertStatus( 422 );
    }

    /** @test */
    public function price_create_normal_structure_should_pass()
    {
        $this->post('/api/v1/prices/create' , [
        	['root'=>['description'=>'root','total'=>900],
        	        	'children'=>[
        	        		['root'=>['description'=>'child1','total'=>631],'children'=>[]],
        	        		['root'=>['description'=>'child2','total'=>31294],
        	        		'children'=>[
        	        			['root'=>['description'=>'child2point3','total'=>0.35,'percentage'=>true],'children'=>null],
        	        			['root'=>['description'=>'child2point3','total'=>8099],'children'=>null],
        	        		]],	
        	        		['root'=>['description'=>'child3','total'=>691],'children'=>null],
        	        	]]
        ] )->assertStatus( 201 );
        $price = Price::find(5);
        $this->assertEquals($price->description, 'child2point3');
    }

    /** @test */
    public function price_create_normal_structure_with_extra_params_should_pass()
    {
        $this->post('/api/v1/prices/create' , [
        	['root'=>['description'=>'root','total'=>900],
        	        	'children'=>[
        	        		['root'=>['description'=>'child1','total'=>631],'children'=>[]],	
        	        		['root'=>['description'=>'child2','total'=>31294,'someExtraKey'=>'SomeExtraValue'],
        	        		'children'=>[
        	        			['root'=>['description'=>'child2point3','total'=>0.35,'percentage'=>true],'children'=>null],
        	        			['root'=>['description'=>'child2point3','total'=>8099],'children'=>null],
        	        		]],	
        	        		['root'=>['description'=>'child3','total'=>691],'children'=>null],	
        	        	]]
        ] )->assertStatus( 201 );
        $price = Price::find(3);
        $this->assertEquals($price->description, 'child2');
        $this->assertEquals($price->total, 31294);
        $this->assertEquals($price->parent_id, 1);
    }

    /** @test */
    public function price_create_malformed_key_should_fail()
    {
        $this->post('/api/v1/prices/create' , [
        	['root'=>['description'=>'root','total'=>900],
        	        	'children'=>[
        	        		['root'=>['description'=>'child1','total'=>631],'children'=>[]],
        	        		['root'=>['description'=>'child2','total'=>31294],
        	        		'children'=>[
        	        			['root'=>['descrtpion'=>'child2point3','total'=>0.35,'percentage'=>true],'children'=>null],
        	        			['root'=>['description'=>'child2point3','total'=>8099],'children'=>null],
        	        		]],	
        	        		['root'=>['description'=>'child3','total'=>691],'children'=>null],	
        	        	]]
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function price_create_malformed_value_should_fail()
    {
        $this->post('/api/v1/prices/create' , [
        	['root'=>['description'=>'root','total'=>900],
        	        	'children'=>[
        	        		['root'=>['description'=>'child1','total'=>631],'children'=>[]],
        	        		['root'=>['description'=>'child2','total'=>'This is not a number'],
        	        		'children'=>[
        	        			['root'=>['description'=>'child2point3','total'=>0.35,'percentage'=>true],'children'=>null],
        	        			['root'=>['description'=>'child2point3','total'=>8099],'children'=>null],
        	        		]],	
        	        		['root'=>['description'=>'child3','total'=>691],'children'=>null],	
        	        	]]
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function price_create_incorrect_percentage_single_positive_should_fail()
    {
        $this->post('/api/v1/prices/create' , [
        	['root'=>['description'=>'root','total'=>900],
        	        	'children'=>[
        	        		['root'=>['description'=>'child1','total'=>631],'children'=>[]],
        	        		['root'=>['description'=>'child2','total'=>31294],
        	        		'children'=>[
        	        			['root'=>['description'=>'child2point3','total'=>1.05,'percentage'=>true],'children'=>null],
        	        			['root'=>['description'=>'child2point3','total'=>8099],'children'=>null],
        	        		]],	
        	        		['root'=>['description'=>'child3','total'=>691],'children'=>null],
        	        	]]
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function price_create_incorrect_percentage_single_negative_should_fail()
    {
        $this->post('/api/v1/prices/create' , [
        	['root'=>['description'=>'root','total'=>900],
        	        	'children'=>[
        	        		['root'=>['description'=>'child1','total'=>631],'children'=>[]],
        	        		['root'=>['description'=>'child2','total'=>31294],
        	        		'children'=>[
        	        			['root'=>['description'=>'child2point3','total'=>-0.52,'percentage'=>true],'children'=>null],
        	        			['root'=>['description'=>'child2point3','total'=>8099],'children'=>null],
        	        		]],	
        	        		['root'=>['description'=>'child3','total'=>691],'children'=>null],
        	        	]]
        ] )->assertStatus( 422 );
    }

    /** @test */
    public function price_create_incorrect_percentage_row_should_fail()
    {
        $this->post('/api/v1/prices/create' , [
        	['root'=>['description'=>'root','total'=>900],
        	        	'children'=>[
        	        		['root'=>['description'=>'child1','total'=>631],'children'=>[]],
        	        		['root'=>['description'=>'child2','total'=>31294],
        	        		'children'=>[
        	        			['root'=>['description'=>'child2point3','total'=>0.81,'percentage'=>true],'children'=>null],
        	        			['root'=>['description'=>'child2point3','total'=>0.92,'percentage'=>true],'children'=>null],
        	        		]],	
        	        		['root'=>['description'=>'child3','total'=>691],'children'=>null],
        	        	]]
        ] )->assertStatus( 422 );
    }



}
