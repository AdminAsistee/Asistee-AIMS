<?php

use Faker\Generator as Faker;

$factory->define( App\Booking::class, function ( Faker $faker ) {

	$checkinDate  = \Carbon\Carbon::now()->addDays( $faker->numberBetween( - 30, 30 ) );
	$checkoutDate = $checkinDate->copy()->addDays( $faker->numberBetween( 1, 5 ) );

	return [
		'listing_id'            => function () {
			$listing  = factory( 'App\Listing' )->create();
			$location = factory( 'App\Location' )->create()->listings()->save( $listing );

			return $listing->id;
		},
		'guest_id'              => function () {
			return factory( 'App\User' )->create( [ 'type' => 'guest' ] )->id;
		},
		'checkin'               => $checkinDate,
		'checkout'              => $checkoutDate,
		'planned_checkin_time'  => $faker->time(),
		'planned_checkout_time' => $faker->time(),
		'guests'                => $faker->numberBetween( 1, 30 ),
		'beds'                  => $faker->numberBetween( 1, 20 ),
		'status'                => $faker->randomElement( [ 'newly_created', 'active', 'suspended', 'discontinued' ] ),

	];
} );








////////////////////// Way overthought this////////////////////////

// <?php

// use Faker\Generator as Faker;
// use App\Booking;
// use App\Listing;
// $factory->define(Booking::class, function (Faker $faker) {
// 	$listing = factory('App\Listing')->create(); 
// 	$location = factory('App\Location')->create()->listings()->save($listing);

// 	$overlap = true;
// 	// infinite loop prevention
// 	$count = 0;
// 	while($overlap && $count < 200){
// 		$interval = $faker->numberBetween(1,365);
// 		$checkin = $faker->dateTimeBetween('2016-01-01','2030-01-01');
// 		$checkout = $faker->dateTimeBetween($checkin,$checkin->format('Y-m-d').' +'.$interval.' days');
// 		$overlappingBookings = Listing::find()->bookings
// 			->where('checkin','<',$checkout)
// 			->where('checkout','>',$checkin);
// 		if($overlappingBookings->count() == 0){
// 			$overlap = false;
// 		}
// 	}
//     return [
//     	'listing_id' => function () {
// 			$listing = factory('App\Listing')->create(); 
// 			$location = factory('App\Location')->create()->listings()->save($listing);
// 			return $listing->id;
// 		},
// 		'guest_id' => function () {
// 			return factory('App\User')->create(['type'=>'guest'])->id; 
// 		},

// 		'checkin'=>$checkin,
// 		'checkout'=>$checkout,
// 		'planned_checkin_time'=>$faker->time(),
// 		'planned_checkout_time'=>$faker->time(),
// 		'guests'=>$faker->numberBetween(1,30),
// 		'beds'=>$faker->numberBetween(0,20),
// 		// 'status'=>$faker->randomElement(['newly_created','active', 'suspended', 'discontinued']),

//     ];
// });
