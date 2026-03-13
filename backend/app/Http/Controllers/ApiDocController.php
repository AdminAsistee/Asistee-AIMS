<?php

namespace App\Http\Controllers;

use App\Mail\TestMail;
use Illuminate\Mail\Mailable;
use URL;

class ApiDocController extends Controller {

	public function test() {
		return response(
			[
				'message' => 'Test successful. API is active'
			] );
	}

	public function landing() {
		return response(
			[
				'message'     => 'Welcome to AIMS API. Try one of the following endpoints',
				'api-v1-path' => URL::to( '/api/v1' ),
			] );
	}

	public function endpoints() {
		return response(
			[
				'message'        => 'Try One of the endpoints below',
				'test'           => [
					'endpoint' => URL::to( '/api/v1/test' ),
					'method'   => 'GET',
				],
				'user'           => [
					'docs' => URL::to( '/api/v1/docs/user' )
				],
				'authentication' => [
					'docs' => URL::to( '/api/v1/docs/oauth' ),
				],
				'location'       => [
					'docs' => URL::to( 'api/v1/docs/location' ),
				]
			] );
	}

	public function user() {
		return response(
			[
				'message'          => 'User Related EndPoints',
				'back_to_index'    => URL::to( '/api/v1' ),
				'register_user'    => [
					'endpoint'   => URL::to( '/api/v1/users' ),
					'method'     => 'POST',
					'parameters' => [ 'name', 'email', 'password' ],
					'permission' => 'public'
				],
				'view_user'        => [
					'endpoint'   => URL::to( '/api/v1/user/{id}' ),
					'method'     => 'GET',
					'permission' => 'admin'
				],
				'view_user_list'   => [
					'endpoint'   => URL::to( '/api/v1/users' ),
					'method'     => 'GET',
					'permission' => 'admin'
				],
				'change_user_type' => [
					'endpoint'   => URL::to( '/api/v1/user/change-type' ),
					'method'     => 'POST',
					'parameters' => [ 'id', 'type', ],
					'permission' => 'admin'
				],

			] );
	}

	public function oauth() {
		return response(
			[
				'message'               => 'Authentication Related Endpoints',
				'back_to_index'         => URL::to( '/api/v1' ),
				'getting_auth_token'    => [
					'endpoint'   => URL::to( '/oauth/token' ),
					'method'     => 'POST',
					'parameters' => [
						[ "key" => "grant_type", "value" => "password" ],
						[ "key" => "username", "value" => "valid email" ],
						[ "key" => "password", "value" => "valid password" ]

					]
				],
				'refreshing_auth_token' => [
					'endpoint'   => URL::to( '/oauth/token' ),
					'method'     => 'POST',
					'parameters' => [
						[ "key" => "grant_type", "value" => "refresh_token" ],
						[
							"key"         => "refresh_token",
							"value"       => '_string_',
							"description" => "refresh_token value obtained previously while getting auth token"
						],
					]
				]

			] );
	}


	public function location() {
		return response(
			[
				'message'            => 'Location Related EndPoints',
				'back_to_index'      => URL::to( '/api/v1' ),
				'register_location'  => [
					'endpoint'   => URL::to( '/api/v1/locations/register' ),
					'method'     => 'POST',
					'parameters' => [ 'building_name', 'room_number', 'address', 'latitude', 'longitude', 'owner_id' ],
					'permission' => 'client-admin'
				],
				'view_location'      => [
					'endpoint'   => URL::to( '/api/v1/locations/{id}' ),
					'method'     => 'GET',
					'permission' => 'admin'
				],
				'view_location_list' => [
					'endpoint'   => URL::to( '/api/v1/locations/index' ),
					'method'     => 'GET',
					'permission' => 'admin'
				],

			] );
	}

	public function mailTest() {
		$data = [
			'name'    => 'Devin Norby',
			'message' => 'This is a test email'
		];
		\Mail::send( new TestMail( $data ) );

		return response( [
			'message' => 'Email Sent'
		] );
	}
}

