<?php

use Faker\Generator as Faker;

$factory->define(App\Supply::class, function (Faker $faker) {
    return [
        "name"=>$faker->word,
		"ready_stock"=>$faker->numberBetween(0,100),
		"in_use_stock"=>$faker->numberBetween(0,100),
		"in_maintenance_stock"=>$faker->numberBetween(0,100),
    ];
});
