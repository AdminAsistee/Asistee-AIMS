<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		Artisan::call( 'passport:install' );
		$this->call( UserSeeder::class );
		$this->call( BookingSeeder::class );
		$this->call( CleaningSeeder::class );
	}
}
