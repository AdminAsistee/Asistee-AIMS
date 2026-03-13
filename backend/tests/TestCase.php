<?php

namespace Tests;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Passport\Passport;

abstract class TestCase extends BaseTestCase {
	use CreatesApplication;
	use RefreshDatabase;
	protected $firstUser, $guestUser, $randomTypeUser, $clientTypeUser, $adminTypeUser, $supervisorTypeUser, $cleanerTypeUser, $secondUser;

	public function setUp() {
		parent::setUp();
		$this->defaultHeaders['X-Requested-With'] = 'XMLHttpRequest';
		$this->firstUser                          = factory( User::class )->create();
		$this->secondUser                         = factory( User::class )->create();
		$this->guestUser                          = factory( User::class )->make( [ 'type' => 'guest' ] );
		$this->randomTypeUser                     = factory( User::class )->create();
		$this->clientTypeUser                     = factory( User::class )->create( [ 'type' => 'client' ] );
		$this->adminTypeUser                      = factory( User::class )->create( [ 'type' => 'administrator' ] );
		$this->supervisorTypeUser                 = factory( User::class )->create( [ 'type' => 'supervisor' ] );
		$this->cleanerTypeUser                    = factory( User::class )->create( [ 'type' => 'cleaner' ] );
		Passport::actingAs( $this->adminTypeUser );
	}
}
