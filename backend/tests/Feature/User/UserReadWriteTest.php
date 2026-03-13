<?php

namespace Tests\Feature\User;

use App\Notifications\PasswordReset;
use Illuminate\Support\Facades\Notification;
use Laravel\Passport\Passport;
use Mockery\Generator\StringManipulation\Pass\Pass;

class UserReadWriteTest extends UserTest {

	/** @test */
	public function admin_can_see_user_list() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users' )
		     ->assertJsonFragment( [ 'email' => 'user1@test.dev' ] )
		     ->assertJsonFragment( [ 'email' => 'user2@test.dev' ] );
	}

	/** @test */
	public function admin_can_see_single_user() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users/1' )
		     ->assertJsonFragment( [ 'id' => 1 ] );
	}

	/** @test */
	public function admin_can_change_user_type() {
		Passport::actingAs( $this->adminTypeUser );

		$this->put( 'api/v1/users/1', [ 'type' => 'cleaner' ] )->assertStatus( 202 );
		$this->get( 'api/v1/users/1' )
		     ->assertJsonFragment( [ 'id' => 1 ] )
		     ->assertJsonFragment( [ 'type' => 'cleaner' ] );
	}

	/** @test */
	public function admin_can_change_user_name() {
		Passport::actingAs( $this->adminTypeUser );

		$this->put( 'api/v1/users/1', [ 'name' => 'Mark Mason' ] )->assertStatus( 202 );
		$this->get( 'api/v1/users/1' )
		     ->assertJsonFragment( [ 'id' => 1 ] )
		     ->assertJsonFragment( [ 'name' => 'Mark Mason' ] );
	}


	/** @test */
	public function admin_can_change_user_bio() {
		Passport::actingAs( $this->adminTypeUser );

		$this->put( 'api/v1/users/1', [ 'bio' => 'Mark Mason\'s bio' ] )->assertStatus( 202 );
		$this->get( 'api/v1/users/1' )
		     ->assertJsonFragment( [ 'id' => 1 ] )
		     ->assertJsonFragment( [ 'bio' => 'Mark Mason\'s bio' ] );
	}

	/** @test */
	public function admin_can_change_user_phone_and_address() {
		Passport::actingAs( $this->adminTypeUser );

		$this->put( 'api/v1/users/1', [
			'phone'   => '+123456789',
			'address' => 'House 1, Road 1, Block D'
		] )->assertStatus( 202 );
		$this->get( 'api/v1/users/1' )
		     ->assertJsonFragment( [ 'id' => 1 ] )
		     ->assertJsonFragment( [ 'phone' => '+123456789' ] )
		     ->assertJsonFragment( [ 'address' => 'House 1, Road 1, Block D' ] );
	}


	/** @test */
	public function admin_can_change_user_password() {
		Passport::actingAs( $this->adminTypeUser );

		$this->put( 'api/v1/users/1', [ 'password' => 'newPassword' ] )->assertStatus( 202 );

	}

	/** @test */
	public function client_can_not_see_or_modify_user() {
		Passport::actingAs( $this->clientTypeUser );

		$this->get( 'api/v1/users' )->assertStatus( 401 );
		$this->get( 'api/v1/users/1' )->assertStatus( 401 );
		$this->put( 'api/v1/users/1', [ 'type' => 'cleaner' ] )->assertStatus( 401 );

	}

	/** @test */
	public function admin_can_delete_a_user() {
		Passport::actingAs( $this->adminTypeUser );
		$this->delete( 'api/v1/users/2' )->assertStatus( 202 );
	}

	/** @test */
	public function admin_can_not_delete_a_non_existing_user() {
		Passport::actingAs( $this->adminTypeUser );
		$this->delete( 'api/v1/users/2000' )->assertStatus( 422 );
	}


	/** @test */
	public function client_can_not_delete_a_user() {
		Passport::actingAs( $this->clientTypeUser );
		$this->delete( 'api/v1/users/2' )->assertStatus( 401 );
	}

	/** @test */
	public function guest_can_not_delete_a_user() {
		Passport::actingAs( $this->guestUser );
		$this->delete( 'api/v1/users/2' )->assertStatus( 401 );
	}

	/** @test */
	public function supervisor_can_not_see_or_modify_user() {
		Passport::actingAs( $this->supervisorTypeUser );

		$this->get( 'api/v1/users' )->assertStatus( 401 );
		$this->get( 'api/v1/users/1' )->assertStatus( 401 );
		$this->put( 'api/v1/users/1', [ 'type' => 'cleaner' ] )->assertStatus( 401 );

	}

	/** @test */
	public function cleaner_can_not_see_or_modify_user() {
		Passport::actingAs( $this->cleanerTypeUser );

		$this->get( 'api/v1/users' )->assertStatus( 401 );
		$this->get( 'api/v1/users/1' )->assertStatus( 401 );
		$this->put( 'api/v1/users/1', [ 'type' => 'cleaner' ] )->assertStatus( 401 );

	}

	/** @test */
	public function guest_can_not_see_or_modify_user() {
		Passport::actingAs( $this->guestUser );

		$this->get( 'api/v1/users' )->assertStatus( 401 );
		$this->get( 'api/v1/users/1' )->assertStatus( 401 );
		$this->put( 'api/v1/users/1', [ 'type' => 'cleaner' ] )->assertStatus( 401 );

	}

	/** @test */
	public function admin_can_filter_user_by_valid_type() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users?type=cleaner' )
		     ->assertJsonFragment( [ 'type' => 'cleaner' ] )
		     ->assertJsonMissing( [ 'type' => 'administrator' ] )
		     ->assertJsonMissing( [ 'type' => 'client' ] )
		     ->assertJsonMissing( [ 'type' => 'supervisor' ] );
	}

	/** @test */
	public function admin_can_filter_user_by_valid_types() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users?type[]=cleaner&type[]=client' )
		     ->assertJsonFragment( [ 'type' => 'cleaner' ] )
		     ->assertJsonMissing( [ 'type' => 'administrator' ] )
		     ->assertJsonFragment( [ 'type' => 'client' ] )
		     ->assertJsonMissing( [ 'type' => 'supervisor' ] );
	}

	/** @test */
	public function admin_can_filter_user_by_empty_type_and_see_all_users() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users?type' )
		     ->assertJsonFragment( [ 'type' => 'cleaner' ] )
		     ->assertJsonFragment( [ 'type' => 'administrator' ] )
		     ->assertJsonFragment( [ 'type' => 'client' ] )
		     ->assertJsonFragment( [ 'type' => 'supervisor' ] );
	}

	/** @test */
	public function admin_can_filter_user_by_valid_type_with_additional_non_existing_param() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users?type=cleaner&garbage=some' )
		     ->assertJsonFragment( [ 'type' => 'cleaner' ] )
		     ->assertJsonMissing( [ 'type' => 'administrator' ] )
		     ->assertJsonMissing( [ 'type' => 'client' ] )
		     ->assertJsonMissing( [ 'type' => 'supervisor' ] );
	}


	/** @test */
	public function admin_can_filter_user_by_full_email_address() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users?email=afzal@srizon.com' )
		     ->assertJsonFragment( [ 'email' => 'afzal@srizon.com' ] )
		     ->assertJsonMissing( [ 'email' => 'user1@test.dev' ] );
	}


	/** @test */
	public function admin_can_filter_user_by_partial_email_address() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users?email=afzal' )
		     ->assertJsonFragment( [ 'email' => 'afzal@srizon.com' ] )
		     ->assertJsonMissing( [ 'email' => 'user1@test.dev' ] );

		$this->get( 'api/v1/users?email=@srizon' )
		     ->assertJsonFragment( [ 'email' => 'afzal@srizon.com' ] )
		     ->assertJsonMissing( [ 'email' => 'user1@test.dev' ] );

		$this->get( 'api/v1/users?email=test.dev' )
		     ->assertJsonFragment( [ 'email' => 'user2@test.dev' ] )
		     ->assertJsonFragment( [ 'email' => 'user1@test.dev' ] );

		$this->get( 'api/v1/users?email' )
		     ->assertJsonFragment( [ 'email' => 'afzal@srizon.com' ] )
		     ->assertJsonFragment( [ 'email' => 'user1@test.dev' ] );
	}

	/** @test */
	public function admin_can_filter_user_by_partial_name() {
		Passport::actingAs( $this->adminTypeUser );

		$this->get( 'api/v1/users?name=afzal' )
		     ->assertJsonFragment( [ 'name' => 'Afzal Hossain' ] )
		     ->assertJsonFragment( [ 'name' => 'Afzal Sharif' ] )
		     ->assertJsonMissing( [ 'name' => 'Sharif Rahman' ] );

		$this->get( 'api/v1/users?name=sharif' )
		     ->assertJsonMissing( [ 'name' => 'Afzal Hossain' ] )
		     ->assertJsonFragment( [ 'name' => 'Afzal Sharif' ] )
		     ->assertJsonFragment( [ 'name' => 'Sharif Rahman' ] );

		$this->get( 'api/v1/users?name=Afzal hossain' )
		     ->assertJsonFragment( [ 'name' => 'Afzal Hossain' ] )
		     ->assertJsonMissing( [ 'name' => 'Afzal Sharif' ] )
		     ->assertJsonMissing( [ 'name' => 'Sharif Rahman' ] );

	}

	/** @test */
	public function anyone_can_request_for_password_reset_with_valid_registered_email_and_reset_password_with_the_token() {
		Notification::fake();
		$this->post( '/api/v1/request-password-reset', [ 'email' => 'does.not.exist@srizon.dev' ] )->assertStatus( 422 );
		$this->post( '/api/v1/request-password-reset' )->assertStatus( 422 );
		$this->post( '/api/v1/request-password-reset', [ 'email' => $this->resetUser->email ] )->assertStatus( 200 );
		Notification::assertSentTo(
			$this->resetUser,
			PasswordReset::class,
			function ( $notification, $channels ) {
				$this->token = $notification->token;

				return strlen( $notification->token ) === 32;
			}
		);
		$this->post( '/api/v1/reset-password', [ 'password' => 'newPassword' ] )->assertStatus( 422 );
		$this->post( '/api/v1/reset-password',
			[
				'token'    => 'invalid-token',
				'password' => 'newPassword'
			]
		)->assertStatus( 422 );

		$this->post( '/api/v1/reset-password',
			[
				'token' => $this->token,
			]
		)->assertStatus( 422 );

		$this->post( '/api/v1/reset-password',
			[
				'token'    => $this->token,
				'password' => 'newPassword'
			]
		)->assertStatus( 200 );


	}
}

