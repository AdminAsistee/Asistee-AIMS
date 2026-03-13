<?php

namespace Tests\Feature\Location;

use App\User;
use App\Location;
use Laravel\Passport\Passport;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterLocationTest extends TestCase {

	protected $randomLocation;

	public function setUp() {
		parent::setUp();
		$this->clientTypeUser = factory( User::class )->create( [ 'type' => 'client' ] );
		$this->randomLocation = factory( Location::class )->create( [ 'owner_id' => $this->clientTypeUser->id ] );
		Passport::actingAs( $this->clientTypeUser );
	}

    /** @test */
    public function locations_auth_client_owner_should_register()
    {
        $this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
    }

    /** @test */
    public function locations_auth_client_can_only_register_own_owner_id()
    {
    	$another_random_client = factory( User::class )->create( [ 'type' => 'client' ] );
        $this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $another_random_client->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
		$this->assertDatabaseHas('locations',['id'=>2,'owner_id'=>$this->clientTypeUser->id]);
		$this->assertDatabaseMissing('locations',['owner_id'=>$another_random_client->id]);
    }



    /** @test */
    public function locations_auth_cleaner_should_not_register()
    {
        $normal_cleaner = factory( User::class )->create( [ 'type' => 'cleaner' ] );
        Passport::actingAs( $normal_cleaner );
        $this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 401 );
    }

    /** @test */
    public function locations_auth_admin_should_register()
    {
        $admin = factory( User::class )->create( [ 'type' => 'administrator' ] );
        Passport::actingAs( $admin );
        $this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
		$this->assertDatabaseHas('locations',['id'=>2,'owner_id'=>$this->clientTypeUser->id]);
    }

    /** @test */
    public function locations_auth_supervisor_should_register()
    {
        $supervisor = factory( User::class )->create( [ 'type' => 'supervisor' ] );
        Passport::actingAs( $supervisor );
        $this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
		$this->assertDatabaseHas('locations',['id'=>2,'owner_id'=>$this->clientTypeUser->id]);
    }



// Location Register Tests

	/** @test */
	public function location_create_id_incrementation() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );

		// $this->get('/api/v1/locations/22')
		//     // Should use Address, but can't figure out how to convert
		//     ->assertStatus( 201 );//assertSeeText('Fuyo Heights');//'芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6');
	}

	/** @test */
	public function location_create_without_building_name_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => '',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_negative_room_number_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => - 247,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_invalid_latitude_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 98.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_invalid_longitude_higher_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => 200.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_invalid_longitude_lower_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 35.6605673,
			'longitude'     => - 20.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_valid_negative_latitude_should_pass() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 72.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
	}

	/** @test */
	public function location_create_with_invalid_negative_latitude_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 101,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 104.6605673,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_latitude_base_case_90_should_pass() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 90.0000000,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
	}

	/** @test */
	public function location_create_with_latitude_base_case_negative_90_should_pass() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 90.0000000,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
	}

	/** @test */
	public function location_create_with_longitude_base_case_0_should_pass() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 72.6605673,
			'longitude'     => 0.0000000,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
	}

	/** @test */
	public function location_create_with_longitude_base_case_180_should_pass() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 72.6605673,
			'longitude'     => 180.0000000,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 201 );
	}

	/** @test */
	public function location_create_with_latitude_base_case_91_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => 91.0000000,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_latitude_base_case_negative_91_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 91.0000000,
			'longitude'     => 139.6676055,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_longitude_base_case_negative_1_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 72.6605673,
			'longitude'     => - 1.0000000,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

	/** @test */
	public function location_create_with_longitude_base_case_181_should_fail() {
		$this->post( '/api/v1/locations/create', [
			'building_name' => 'Fuyo Heights',
			'room_number'   => 402,
			'address'       => '芙蓉ハイツⅡ 〒155-0031 Tōkyō-to Setagaya-ku Kitazawa 1 Chome−37−6',
			'latitude'      => - 72.6605673,
			'longitude'     => 181.0000000,
			'owner_id'      => $this->clientTypeUser->id,
			'map_link'=>"www.google.com",
			'entry_info'=>"Enter at your own risk. Code is 4315",
		] )->assertStatus( 422 );
	}

}