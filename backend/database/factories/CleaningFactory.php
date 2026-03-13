<?php

use Faker\Generator as Faker;

$factory->define(App\Cleaning::class, function (Faker $faker) {
    return [
        'location_id' => factory('App\Location')->create()->id,
		'cleaner_id' => factory('App\User')->create(['type'=>'cleaner'])->id,
		'cleaning_date'=> $faker->dateTimeBetween('-10 days','20 days'),
		'staff_payout_price_id'=>factory('App\Price')->create(['total'=>$faker->numberBetween(1,3000),
			'percentage'=>false])->id,
		'client_charge_price_id'=>factory('App\Price')->create(['total'=>$faker->numberBetween(5000,20000),
			'percentage'=>false])->id,
		'note_id'=>$faker->numberBetween(1,3000),
		'start_time'=>$faker->time(),
		'end_time'=>$faker->time(),
		'status'=>$faker->randomElement(['newly_created','active', 'suspended', 'discontinued']),
		
    ];
});
