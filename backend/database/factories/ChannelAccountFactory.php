<?php

use Faker\Generator as Faker;

$factory->define(App\ChannelAccount::class, function (Faker $faker) {
    return [
    	'description' => $faker->text(64),
		'channel_id' => $faker->numberBetween(1,30),
		'authentication_token'=>encrypt($faker->word()),
		'authentication_key'=>encrypt($faker->word()),
		'authentication_information'=>json_encode([ 'SomePieceOfInformation'=>$faker->word()]),
    ];
});
