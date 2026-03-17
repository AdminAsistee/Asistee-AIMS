<?php

namespace App\Channels;
use App\Booking;
use App\User;
use App\Price;
use App\Listing;
use App\Cleaning;

class ChannelProcessor
{ 
	// Takes a channel object that has already been successfully preprocessed, and compares the internal
	// system with the results of the pre-processed data, noting new bookings, deleted bookings, and
	// updating items, along with 
	public function updateListingFromPull($booking_list, $listing, $start_date, $end_date)
	{
		// Making this a more pure function right now , could move listing and bookings (already done)
		// into channel object, and call here to getPulledBookings and getActiveListing
		// $bookings = $channel->getPulledBookings();
		// DO MORE PROCESSING!
    	$created_bookings = [];
    	$updated_bookings = [];
    	$deleted_bookings = [];
    	$created_cleanings = [];
    	$updated_cleanings = [];
    	$deleted_cleanings = [];

    	for ($i=0; $i < count($booking_list); $i++) { 
    		// Setup
    		$current_booking = $booking_list[$i];
			$guest = null;
			// Get booking , associated details
			$existing_booking = Booking::where(['listing_id'=>$listing->id,
				'confirmation_code'=>$current_booking['confirmation_code']])->get();
			if($existing_booking->count() == 0) {
				// DNE , create new booking
				// create guest account
				$guestEmail = $current_booking['confirmation_code'] . '@aims-guest.local';
				$guest = User::firstOrCreate(
					['email' => $guestEmail],
					[
						'name'     => $current_booking['guest_name'],
						'type'     => 'guest',
						'email'    => $guestEmail,
						'password' => bcrypt('ILoveTravel'),
					]
				);
				// Email Guest if has email. Or send message.
				// create price object
				$price = Price::create(['total' => $current_booking['price'] ?? 0,
				'description'=> $current_booking['confirmation_code'] . ' ' . $current_booking['guest_name'] . ' booking Payout.']);
				// if split create split components
				if(!is_null($listing->default_management_split_rate)){
					Price::create(['parent_id'=>$price->id,
						'total'=>$listing->default_management_split_rate,
						'description'=>'management split',
						'percentage'=>true,
					]);
					Price::create(['parent_id'=>$price->id,
						'total'=>(1-$listing->default_management_split_rate),
						'description'=>'client split',
						'percentage'=>true,
					]);
				}
				// possibly create note , other objects here.
				// XXXXXX
				// create new booking
				$booking = Booking::create( [
					'listing_id'=>$listing->id,
					'source_channel_account_id'=>$listing->channel_account_id,
					'confirmation_code'=>$current_booking['confirmation_code'],
					'checkin' => $current_booking['checkin'],
					'checkout' => $current_booking['checkout'],
					'guests' => $current_booking['number_of_guests'],
					'beds' => $current_booking['number_of_beds'],
					'guest_id'=>$guest->id,
					'price_id'=>$price->id,
					 ] ) ;
				// Create Cleanings for all locations for locations on checkout
				$listing->locations->each(function($location) use ($current_booking, $created_cleanings) {
					$staff_payout_price = Price::create(['total' => $location->default_staff_cleaning_payout ?? 0,
						'description'=>'Staff payout price for cleaning on [' . $current_booking['checkout'] . '] at [' . $location->room_number . ' ' . $location->building_name . '].',
					]);
					$client_charge_price = Price::create(['total' => $location->default_client_charge ?? 0,
						'description'=>'Client Charge for cleaning on [' . $current_booking['checkout'] . '] at [' . $location->room_number . ' ' . $location->building_name . '].',
					]);
					$cleaning = Cleaning::create( [
						'location_id'=>$location->id,
						'cleaning_date'=>$current_booking['checkout'],
						'staff_payout_price_id'=>$staff_payout_price->id,
						'client_charge_price_id'=>$client_charge_price->id,
					] );
					$created_cleanings[] = $cleaning;
				});

				// Update other listings here! (Listing->locations->listings)
				// updateListingLinkedListings($listing, checkin, checkout);

				$created_bookings[] = $booking;

			} else {
				// Exists, Update
				$booking = $existing_booking[0];
				$booking->checkin = $current_booking['checkin'];
				// update cleanings if checkout updates
				if($booking->checkout != $current_booking['checkout']){
					$listing->locations->each(function($location) use ($booking,$current_booking, $created_cleanings, $updated_cleanings) {
						$cleaning_list = Cleaning::where( [
							'location_id'=>$location->id,
							'cleaning_date'=>date("Y-m-d",strtotime($booking->checkout)),
						] )->get();
						if($cleaning_list->count() == 0) {//create cleaning on }
							$cleaning = Cleaning::create( [
								'location_id'=>$location->id,
								'cleaning_date'=>$current_booking['checkout'],
								'staff_payout_price_id'=>Price::create([
									'total' => $location->default_staff_cleaning_payout ?? 0,
									'percentage'=>false,
									'description'=>'Staff Payout for ' . $location->room_number . ' ' . $location->building_name . ' on ' . $current_booking['checkout'] . ' via BOOKING(' . $booking->id . ')',
								]),
								'client_charge_price_id'=>Price::create([
									'total' => $location->default_client_charge ?? 0,
									'percentage'=>false,
									'description'=>'Staff Payout for ' . $location->room_number . ' ' . $location->building_name . ' on ' . $current_booking['checkout'] . ' via BOOKING(' . $booking->id . ')',
								]),
							] );
							$created_cleanings[] = $cleaning;	
						} else {
							$cleaning = $cleaning_list[0];
							if($cleaning->cleaning_date != $current_booking['checkout']){
								$cleaning->cleaning_date = $current_booking['checkout'];
								$cleaning->save();
								$updated_cleanings[] = $cleaning;
							}
						}
					});
				}

				$booking->checkout = $current_booking['checkout'];
				$booking->guests = $current_booking['number_of_guests'];
				// $booking->beds = $current_booking['number_of_beds']; Do not update beds
				$price = $booking->price;
				$price->total = $current_booking['price'] ?? 0;
				$price->save();
				$booking->save();

				$updated_bookings[] = $booking;
			}

		}//end for
		return ['listing'=>$listing,
			'start_date'=>$start_date,
			'end_date'=>$end_date,
			'created_bookings'=>$created_bookings,
			'updated_bookings'=>$updated_bookings,
			'deleted_bookings'=>$deleted_bookings,
			// TODO : Take out cleaning functionality from here. Extract to helper object or booking model.
			'created_cleanings'=>$created_cleanings,
			'updated_cleanings'=>$updated_cleanings,
			'deleted_cleanings'=>$deleted_cleanings,
		];
	}


}
