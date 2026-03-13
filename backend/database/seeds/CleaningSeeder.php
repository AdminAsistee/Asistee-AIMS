<?php

use Illuminate\Database\Seeder;

class CleaningSeeder extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		factory( \App\Cleaning::class, 300 )->create();
	}
}
