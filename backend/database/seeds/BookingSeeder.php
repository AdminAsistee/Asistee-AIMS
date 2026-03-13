<?php

use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
        factory(\App\Booking::class,300)->create();
//		factory( \App\Supply::class, 12 )->create();
	}
}
