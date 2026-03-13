<?php

namespace Tests\Feature\User;

use App\User;
use Tests\TestCase;

class UserTest extends TestCase {
	protected $resetUser;
	protected $namedUser1;
	protected $namedUser2;
	protected $namedUser3;
	protected $token;

	public function setUp() {
		parent::setUp();

		factory( User::class )->create( [ 'email' => 'user1@test.dev' ] );
		factory( User::class )->create( [ 'email' => 'user2@test.dev' ] );
		factory( User::class )->create( [ 'email' => 'afzal@srizon.com' ] );
		$this->resetUser = factory( User::class )->create( [ 'email' => 'reset@srizon.com' ] );

		factory( User::class, 2 )->create();
		factory( User::class, 2 )->create( [ 'type' => 'client' ] );
		factory( User::class, 2 )->create( [ 'type' => 'administrator' ] );
		factory( User::class, 2 )->create( [ 'type' => 'supervisor' ] );
		factory( User::class, 2 )->create( [ 'type' => 'cleaner' ] );

		$this->namedUser1 = factory( User::class )->create( [ 'name' => 'Afzal Hossain' ] );
		$this->namedUser2 = factory( User::class )->create( [ 'name' => 'Afzal Sharif' ] );
		$this->namedUser3 = factory( User::class )->create( [ 'name' => 'Sharif Rahman' ] );
	}

	/** @test */
	public function suppressWarning() {
		$this->assertTrue( true );
	}
}
