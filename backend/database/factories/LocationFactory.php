<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\Location::class, function (Faker $faker) {
    return [
        'building_name'=>$faker->word,
		'room_number'=>$faker->numberBetween(100,1000),
		'address'=>$faker->address,
		'latitude'=>$faker->latitude(27, 38),
		'longitude'=>$faker->longitude(46, 150),

		'map_link'=>$faker->word,
		'guest_photo_directions_link'=>$faker->word,
		'max_beds'=>$faker->numberBetween(1,20),
		'entry_info'=>$faker->sentence,
		'mail_rules'=>$faker->sentence,
		'trash_rules'=>$faker->sentence,

		'status'=>$faker->randomElement(['newly_created','active', 'suspended', 'discontinued']),
		'owner_id' => function () {
			return factory('App\User')->create(['type'=>'client'])->id; 
		},
		'channel_manager_id'=>$faker->numberBetween(100,1000), // < CHANGE TO function () (return factory('App\ChannelManager')->create();),
		'default_staff_cleaning_payout'=>$faker->numberBetween(2500,12000),
		'default_client_charge'=>$faker->numberBetween(4000,35000),
		'per_bed_charge'=>$faker->numberBetween(500,2000),
		'per_guest_charge'=>$faker->numberBetween(0,3000),
		'SplitRate'=>$faker->randomFloat(4, 0, 1),
    ];
});
