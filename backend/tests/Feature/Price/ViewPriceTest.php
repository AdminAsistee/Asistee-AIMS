<?php

namespace Tests\Feature\Price;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Price;
 
class ViewPriceTest extends TestCase
{

	protected $randomLocation, $randomLocations;

    public function setUp() {
        parent::setUp();
        factory( Price::class )->create( ['description'=>'This is the root price','total'=>99999,'percentage'=>false] );
        // first row
        factory( Price::class )->create( ['parent_id'=>1,'description'=>'1/2 level child percentage','total'=>.08,'percentage'=>true] );
        factory( Price::class )->create( ['parent_id'=>1,'description'=>'1/2 level child number','total'=>20875,'percentage'=>false] );
        factory( Price::class )->create( ['parent_id'=>1,'description'=>'1/2 level child number','total'=>2508352,'percentage'=>false] );
        factory( Price::class )->create( ['parent_id'=>1,'description'=>'1/2 level child percentage','total'=>.02,'percentage'=>true] );

        factory( Price::class )->create( ['parent_id'=>2,'description'=>'2/2 level child percentage','total'=>.2,'percentage'=>true] );
        factory( Price::class )->create( ['parent_id'=>2,'description'=>'2/2 level child percentage','total'=>.8,'percentage'=>true] );

        factory( Price::class )->create( ['parent_id'=>3,'description'=>'2/2 level child percentage','total'=>.3,'percentage'=>true] );
        factory( Price::class )->create( ['parent_id'=>3,'description'=>'2/2 level child number','total'=>15000,'percentage'=>false] );

        factory( Price::class )->create( ['parent_id'=>4,'description'=>'2/2 level child number','total'=>1500,'percentage'=>false] );
        factory( Price::class )->create( ['parent_id'=>4,'description'=>'2/2 level child number','total'=>3126,'percentage'=>false] );
    }

    /** @test */
    public function price_view_normal_single_should_pass()
    {
        $this->get('/api/v1/prices/1')
        	->assertStatus( 200 );
    }

    /** @test */
    public function price_view_non_existent_should_fail()
    {
        $this->get('/api/v1/prices/84762')
        	->assertStatus( 422 );
    }

    /** @test */
    public function price_view_normal_single_should_show_amount()
    {
        $this->get('/api/v1/prices/1')
        	->assertJsonFragment( ['total'=>28949.523809523813] );
    }

    /** @test */
    public function price_view_normal_single_should_show_null_children()
    {
        $this->get('/api/v1/prices/1')
        	->assertJsonFragment( ['children'=>null] );
    }

    /** @test */
    public function price_view_should_have_json_structure()
    {
        $this->get('/api/v1/prices/1')
        	->assertJsonStructure( ['root'=>['description','total'],'children'] );
    }

    /** @test */
    public function price_view_normal_prices_should_show_correct_amount()
    {
        $this->get('/api/v1/prices/1')
        	->assertSeeText('"total":28949.52')
        	->assertSeeText('"total":2315.96')
        	->assertSeeText('"total":463.19')
        	->assertSeeText('"total":1852.76')
        	->assertSeeText('"total":21428.57')
        	->assertSeeText('"total":6428.57')
        	->assertSeeText('"total":15000')
        	->assertSeeText('"total":4626')
        	->assertSeeText('"total":1500')
        	->assertSeeText('"total":3126')
        	->assertSeeText('"total":578.99');
    }

    /** @test */
    public function price_view_normal_one_layer_three_prices_normal_should_show_breakdown()
    {
        $this->get('/api/v1/prices/1')
        	->assertJson( [
			    "root"=>["description"=>"This is the root price"]
			])
        	->assertJson( [
			    "children"=>[[
		            "root"=>[
		                "description"=>"1/2 level child percentage",
		                "percentage"=>0.08
		            ]]
		        ]
		    ]);
		    // ->assertJson( [
		    // 	"root"=>["description"=>"1/2 level child number"],
			   //  "children"=>[
			   //  	[
		    //         "root"=>["description"=>"2/2 level child number"],
		    //         "children"=>null
		    //     	]
		    //     ]
		    // ]);
    }

}
