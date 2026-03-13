<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		foreach ( \App\User::$types as $type ) {
			factory( \App\User::class )->create(
				[
					'type'     => $type,
					'email'    => $type . '@aims.com',
					'password' => bcrypt('adminadmin')
				] );
			factory( \App\User::class )->create(
				[
					'type'     => $type,
					'email'    => $type . '2@aims.com',
					'password' => bcrypt('adminadmin')
				] );
			factory( \App\User::class )->create(
				[
					'type'     => $type,
					'email'    => $type . '3@aims.com',
					'password' => bcrypt('adminadmin')
				] );
		}

		factory(\App\User::class,25)->create();
	}
}
