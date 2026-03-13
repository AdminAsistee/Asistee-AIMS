<?php

use Faker\Generator as Faker;

$factory->define( App\Listing::class, function ( Faker $faker ) {
	return [
		'channel_account_id' => $faker->numberBetween( 1, 1000 ),
		'channel_listing_id' => $faker->numberBetween( 1, 100000 ),
		'status'             => $faker->randomElement( \App\Listing::$field_status ),
		'listing_title'      => $faker->word,
	];
} );
