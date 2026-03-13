<?php

use Faker\Generator as Faker;

$factory->define(App\Price::class, function (Faker $faker) {
	$percentage = $faker->numberBetween(0,1) ? true : false;
	if($percentage){
		$total = $faker->randomFloat(2, 0, 1);
	} else {
		$total = $faker->numberBetween(-100000,1000000);
	}
    return [
        'description'=>$faker->word,
        'total'=>$total,
        'percentage'=>$percentage,
        'parent_id'=>null,
    ];
});
