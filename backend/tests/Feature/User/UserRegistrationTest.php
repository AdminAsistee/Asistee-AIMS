<?php

namespace Tests\Feature\User;

class UserRegistrationTest extends UserTest {
	/** @test */
	public function anyone_can_register_with_required_fields() {
		$response = $this->post( 'api/v1/users', [
			'name'     => 'Afzal Hossain',
			'email'    => 'afzal.csedu@gmail.com',
			'password' => 'admin123'
		] );

		$response->assertStatus( 201 );
	}

	/** @test */
	public function user_registration_should_fail_without_name() {
		$response = $this->post( 'api/v1/users', [
			'name'     => '',
			'email'    => 'afzal.csedu@gmail.com',
			'password' => 'admin123'
		] );

		$response->assertStatus( 422 );
	}

	/** @test */
	public function user_registration_should_fail_without_email() {
		$response = $this->post( 'api/v1/users', [
			'name'     => 'Afzal Hossain',
			'email'    => '',
			'password' => 'admin123'
		] );

		$response->assertStatus( 422 );
	}

	/** @test */
	public function user_registration_should_fail_with_invalid_email() {
		$response = $this->post( 'api/v1/users', [
			'name'     => 'Afzal Hossain',
			'email'    => 'www.com@@',
			'password' => 'admin123'
		] );

		$response->assertStatus( 422 );
	}

	/** @test */
	public function user_registration_should_fail_without_password() {
		$response = $this->post( 'api/v1/users', [
			'name'     => 'Afzal Hossain',
			'email'    => 'afzal.csedu@gmail.com',
			'password' => ''
		] );

		$response->assertStatus( 422 );
	}

	/** @test */
	public function user_registration_should_fail_without_password_less_than_6_character() {
		$response = $this->post( 'api/v1/users', [
			'name'     => 'Afzal Hossain',
			'email'    => 'afzal.csedu@gmail.com',
			'password' => 'abcde'
		] );

		$response->assertStatus( 422 );
	}
}
