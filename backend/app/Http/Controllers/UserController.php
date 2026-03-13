<?php

namespace App\Http\Controllers;

use App\PasswordResets;
use App\Rules\EnsureOneAdmin;
use App\Rules\TokenFresh;
use App\Scopes\UserFilter;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;

class UserController extends Controller {
	protected $validationRulesForCreation = [
		'name'     => 'required|min:3',
		'email'    => 'required|email|unique:users,email',
		'password' => 'required|min:6|max:64',
	];

	protected $validationRulesForUpdate = [
		'name'     => 'min:3',
		'email'    => 'email|unique:users,email',
		'password' => 'min:6|max:64',
	];

	protected $validationRulesForPasswordResetRequest = [
		'email' => 'required|exists:users,email'
	];

	protected $validationRulesForPasswordReset = [
		'token'    => [ 'required', 'exists:password_resets,token' ],
		'password' => 'required|min:6|max:64'
	];

	protected $updateable = [
		'administrator' => [
			'name',
			'email',
			'password',
			'bio',
			'phone',
			'address',
			'type'
		]
	];
	private $validationRulesForDeletion;

	public function __construct() {
		// add rules classes for additional validation
		$this->validationRulesForCreation['type']         = 'in:' . implode( ',', User::$types );
		$this->validationRulesForUpdate['type'][]         = 'in:' . implode( ',', User::$types );
		$this->validationRulesForUpdate['type'][]         = new EnsureOneAdmin;
		$this->validationRulesForPasswordReset['token'][] = new TokenFresh;
		$this->validationRulesForDeletion                 = [];
	}

	/**
	 * @param UserFilter $filter
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function index( UserFilter $filter ) {
		/** @var Paginator $users */
		$users = User::filter( $filter )->paginate( 20 );

		return response( $users, 200 );
	}


	/**
	 * @param User $user
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function show( User $user ) {
		return response( $user, 200 );
	}

	/**
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function register( Request $request ) {

		if ( $this->validationFails( $request->all(), $this->validationRulesForCreation ) ) {
			return $this->validationResponse;
		}
		$createdUser = User::create( $this->mutateForCreation( $request->all() ) );

		return $this->creationSuccessResponse( 'User', $createdUser->id );
	}

	/**
	 * Mutate necessary fields before creation
	 *
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForCreation( $request ) {
		$request['password'] = bcrypt( $request['password'] );
		$request['type']     = env( 'DEV_EMAIL' ) === $request['email'] ? 'administrator' : 'client';

		return $request;
	}

	/**
	 * @param User $user
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function update( User $user, Request $request ) {

		$valid_requests = $request->only( $this->updateable[ \Auth::user()->type ] );
		if ( $this->validationFails( $valid_requests, $this->validationRulesForUpdate ) ) {
			return $this->validationResponse;
		}

		$user->update( $this->mutateForUpdate( $valid_requests ) );

		return $this->updateSuccessResponse( 'User' );
	}

	/**
	 * Mutate necessary fields before update
	 *
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForUpdate( $request ) {
		if ( isset( $request['password'] ) ) {
			$request['password'] = bcrypt( $request['password'] );
		}

		return $request;
	}

	/**
	 * @param User $user
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function delete( User $user ) {
		if ( $this->validationFails( [ 'id' => $user->id ], $this->validationRulesForDeletion ) ) {
			return $this->validationResponse;
		}
		$user->delete();

		return $this->deleteSuccessResponse( 'User' );
	}

	/**
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function requestPasswordReset( Request $request ) {

		if ( $this->validationFails( $request->all(), $this->validationRulesForPasswordResetRequest ) ) {
			return $this->validationResponse;
		}
		$token = str_random( 32 );
		PasswordResets::create( [ 'email' => $request->get( 'email' ), 'token' => $token ] );
		User::whereEmail( $request->get( 'email' ) )->first()->sendPasswordResetNotification( $token );

		return response( [ 'message' => 'reset instructions sent' ] );
	}

	/**
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function performPasswordReset( Request $request ) {

		if ( $this->validationFails( $request->all(), $this->validationRulesForPasswordReset ) ) {
			return $this->validationResponse;
		}
		User::updatePassword( $request->token, $request->password );

		return response( [ 'message' => 'Password Updated' ], 200 );
	}

	/**
	 * @param Request $request
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function saveCard( Request $request ) {
		$stripe_obj = $request->stripe;
		$user       = \Auth::user();
		if ( strlen( $user->card_last_four ) === 4 ) {
			$user->updateCard( $stripe_obj['id'] );
		} else {
			$user->createAsStripeCustomer( $stripe_obj['id'], [ 'email' => $user->email ] );
		}

		// for charging $user->charge($amount)
		// \Auth::user()->charge(2000);

		return response( $user, 200 );
	}

	/**
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function me() {
		return response( \Auth::user(), 200 );
	}

	/**
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function logout() {
		\Auth::user()->token()->revoke();

		return response( [ 'message' => 'Logout successful!' ] );
	}

}
