<?php

namespace Tests\Feature;

use Laravel\Passport\Passport;
use Tests\TestCase;

class AuthorizationTest extends TestCase {
	public function setUp() {
		parent::setUp();
	}

	public function a_guest_cannot_go_to_private_route() {
		Passport::actingAs( $this->guestUser );
		$this->get( 'api/v1/private' )->assertStatus( 401 );
		$this->get( 'api/v1/admin' )->assertStatus( 401 );
		$this->get( 'api/v1/client' )->assertStatus( 401 );
	}

	/** @test */
	public function any_authenticated_user_can_go_to_private_route() {
		Passport::actingAs( $this->randomTypeUser );
		$this->get( 'api/v1/private' )->assertStatus( 200 );
	}

	/** @test */
	public function client_type_user_can_go_to_private_route() {
		Passport::actingAs( $this->clientTypeUser );
		$this->get( 'api/v1/private' )->assertStatus( 200 );
	}

	/** @test */
	public function client_type_user_can_go_to_client_only_route() {
		Passport::actingAs( $this->clientTypeUser );
		$this->get( 'api/v1/client' )->assertStatus( 200 );
	}

	/** @test */
	public function client_type_user_cannot_go_to_admin_only_route() {
		Passport::actingAs( $this->clientTypeUser );
		$this->get( 'api/v1/admin' )->assertStatus( 401 );
	}

	/** @test */
	public function admin_type_user_can_go_to_private_route() {
		Passport::actingAs( $this->adminTypeUser );
		$this->get( 'api/v1/private' )->assertStatus( 200 );
	}

	/** @test */
	public function admin_type_user_can_go_to_admin_only_route() {
		Passport::actingAs( $this->adminTypeUser );
		$this->get( 'api/v1/admin' )->assertStatus( 200 );
	}

	/** @test */
	public function admin_type_user_cannot_go_to_client_only_route() {
		Passport::actingAs( $this->adminTypeUser );
		$this->get( 'api/v1/client' )->assertStatus( 401 );
	}

	/** @test */
	public function admin_type_user_can_go_to_client_admin_route() {
		Passport::actingAs( $this->adminTypeUser );
		$this->get( 'api/v1/client-admin' )->assertStatus( 200 );
	}

	/** @test */
	public function client_type_user_can_go_to_client_admin_route() {
		Passport::actingAs( $this->clientTypeUser );
		$this->get( 'api/v1/client-admin' )->assertStatus( 200 );
	}

	/** @test */
	public function supervisor_type_user_cannot_go_to_client_admin_route() {
		Passport::actingAs( $this->supervisorTypeUser );
		$this->get( 'api/v1/client-admin' )->assertStatus( 401 );
	}

	/** @test */
	public function supervisor_type_user_cannot_go_to_client_route() {
		Passport::actingAs( $this->supervisorTypeUser );
		$this->get( 'api/v1/client' )->assertStatus( 401 );
	}

	/** @test */
	public function supervisor_type_user_cannot_go_to_admin_route() {
		Passport::actingAs( $this->supervisorTypeUser );
		$this->get( 'api/v1/admin' )->assertStatus( 401 );
	}

	/** @test */
	public function cleaner_type_user_cannot_go_to_client_admin_route() {
		Passport::actingAs( $this->cleanerTypeUser );
		$this->get( 'api/v1/client-admin' )->assertStatus( 401 );
	}

	/** @test */
	public function cleaner_type_user_cannot_go_to_admin_route() {
		Passport::actingAs( $this->cleanerTypeUser );
		$this->get( 'api/v1/admin' )->assertStatus( 401 );
	}

	/** @test */
	public function cleaner_type_user_cannot_go_to_client_route() {
		Passport::actingAs( $this->cleanerTypeUser );
		$this->get( 'api/v1/client' )->assertStatus( 401 );
	}
}
