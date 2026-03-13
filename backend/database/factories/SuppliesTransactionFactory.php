<?php

use Faker\Generator as Faker;

$factory->define(App\SuppliesTransaction::class, function (Faker $faker) {
    return [
        'amount'=>$faker->numberBetween(0,100),
'status'=>$faker->randomElement(['not_fulfilled','staged', 'delivered']),
'supply_id'=>factory('App\Supply')->create(),
'cleaning_id'=>factory('App\Cleaning')->create(),
    ];
});
