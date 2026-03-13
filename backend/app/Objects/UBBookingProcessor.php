<?php

namespace App\Objects;

use App\Booking;
use App\User;
use App\Cleaning;
use App\Listing;
use App\Objects\UBCleaningProcessor;
use App\Notifications\EmailCleaningTFChange;

class UBBookingProcessor {
	public $booking;
	public $system_booking;
	public $updated;
	public $created;
	public $error;
	public $cleaning_results;
	public $output_file;

	/**
	 * UBBookingProcessor constructor.
	 *
	 * @param $data
	 */
	public function __construct( $booking,$output_file="" ) {
		$this->booking = $booking;
		$this->system_booking = null;
		$this->updated = false;
		$this->created = false;
		$this->error = null;
		$this->cleaning_results = [];
		$this->output_file = $output_file;
	}

	/**
	 * Perform the Draw and Update Booking root logic.
	 *
	 * @return $this
	 */
	public function process(){
\Storage::append($this->output_file, PHP_EOL."-----PROCESSING-BOOKING----- => ". json_encode($this->booking,JSON_UNESCAPED_UNICODE) . PHP_EOL . PHP_EOL);
		//Step 1: Check if booking exists
// TODO : Gracefully fail in event of no database.
		$system_bookings = Booking::where([
			'listing_id'=>$this->booking['listing_id'],
			'confirmation_code'=>$this->booking['confirmation_code']
		]);
		// Error
		if($system_bookings->count() > 1){
\Storage::append($this->output_file, "BOOKING EXISTENTIAL ERROR!".PHP_EOL);
			$this->error = ">1 Booking";
			return false;
		// Update
		} elseif($system_bookings->count() > 0){
//echo "UPDATE-BOOKING LOGIC... ";
			$this->system_booking = $system_bookings->get()[0];
			$this->update_booking();
		// Make New
		} else {

			$listing = Listing::find($this->booking['listing_id']);
			if(\App\Booking::overlaps($listing,$this->booking['checkin'],$this->booking['checkout'])){
				$this->error = "*** DOUBLE BOOKING ERROR -- listing_id[".$this->booking['listing_id']."], checkin[".$this->booking['checkin']."], checkin[".$this->booking['checkout'] . " Overlaps with another booking!! Skipping... NOT Creating booking/Cleaning!!". PHP_EOL;
				return false;
}

\Storage::append($this->output_file, "CREATING-BOOKING: listing_id[".$this->booking['listing_id']."], checkin[".$this->booking['checkin']."], checkin[".$this->booking['checkout']."]!".PHP_EOL);
			$this->system_booking = Booking::create([
				'listing_id'=>$this->booking['listing_id'],
            	'confirmation_code'=>$this->booking['confirmation_code'],
            	'checkin'=>$this->booking['checkin'],
            	'checkout'=>$this->booking['checkout'],
            	'guests'=>$this->booking['number_of_guests'],
            	'beds'=>$this->booking['number_of_beds'],
            	'guest_name'=>$this->booking['guest_name'],
            	'payout_price'=>$this->booking['price'],
            ]);

            // Create Cleanings:
			$this->system_booking->listing->locations->map(function($location) {
\Storage::append($this->output_file,  "CREATING-CLEANING: location_id[".$location->id."][".$location->building_name." ". $location->room_number ."], cleaning_date[".$this->system_booking->checkout."]!".PHP_EOL);
            		$cleaning = [
                        'location_id'=>$location->id,
                        'cleaning_date'=>$this->system_booking->checkout,
                    ];
            		$this->process_cleaning($cleaning,null);

            		//// TF Notification Logic ///
            		// Check if cleaning Exists
            		$cleanings = Cleaning::where([
                        'location_id'=>$location->id,
                        'cleaning_date'=>$this->system_booking->checkin,
                    ]);
                    if($cleanings->count() > 1){
						\Storage::append($this->output_file, "*** TF CLEANING CHECK ERROR! >1 Cleaning Exists for Location[".$location->id."] on [".$this->system_booking->checkin."]".PHP_EOL);
						echo "*** TF CLEANING CHECK ERROR! >1 Cleaning Exists for Location[".$location->id."] on [".$this->system_booking->checkin."]".PHP_EOL;
					// Update
					} elseif($cleanings->count() > 0){
						$TF_update_cleaning = $cleanings->get()[0];
// echo "TF_UPDATE_CLEANING OBJECT IS:" . json_encode($TF_update_cleaning);
if(!is_null($TF_update_cleaning->cleaner)){
						$TF_update_cleaning->cleaner->notify( new EmailCleaningTFChange( $TF_update_cleaning ));
}
            			User::where('email','Aiko@Asistee.com')->get()[0]->notify( new EmailCleaningTFChange( $TF_update_cleaning ));
					} // else no TF cleaning change, do nothing.

            		////
                });

            $this->created = true;
		}
		return true;
	}

	public function update_booking(){
\Storage::append($this->output_file, "UPDATING-BOOKING[".$this->system_booking->id."]: listing_id[".$this->system_booking->listing->id."][".$this->system_booking->listing->listing_title."], checkin[".$this->system_booking->checkin."], checkout[".$this->system_booking->checkout."]!".PHP_EOL);
		$last_checkout = $this->system_booking->checkout;
// Set Items and save.
		$this->system_booking->checkin = $this->booking['checkin'];
        $this->system_booking->checkout = $this->booking['checkout'];
        $this->system_booking->guests = $this->booking['number_of_guests'];
        $this->system_booking->beds = $this->booking['number_of_beds'];
        $this->system_booking->guest_name = $this->booking['guest_name'];
        $this->system_booking->payout_price = $this->booking['price'];
        // $booking_price = $this->system_booking->price;
        // if(!is_null($booking_price)){
        //     $booking_price->total=$this->booking['price'];
        //     $booking_price->save();
        // }
        $lastUpdated = $this->system_booking->updated_at->toDateTimeString();
        $this->system_booking->save();

// If any item was updated, flag updated.
        $this->check_if_updated($lastUpdated,$last_checkout);
        return true;
	}

	public function check_if_updated($lastUpdated,$last_checkout){
		if($lastUpdated != $this->system_booking->updated_at->toDateTimeString()){
            $this->updated = true;

            // if Checkout updated: update cleanings, log.
// echo "DEBUG : last_checkout[".$last_checkout."], this->system_booking->checkout[".$this->system_booking->checkout."], Function_output[".($last_checkout != $this->system_booking->checkout)."]!".PHP_EOL;
            // if($last_checkout != $this->system_booking->checkout){
            	$this->system_booking->listing->locations->map(function($location) use ($last_checkout){
\Storage::append($this->output_file, "PROCESSING-CLEANING: location_id[".$location->id."][".$location->building_name." ". $location->room_number ."], cleaning_date[".$last_checkout."]=>[".$this->system_booking->checkout."]!".PHP_EOL);
            		$cleaning = [
                        'location_id'=>$location->id,
                        'cleaning_date'=>$last_checkout,
                    ];

            		$this->process_cleaning($cleaning,$this->system_booking->checkout);
                });
            // }
        }
	}

	public function process_cleaning($cleaning,$update_to){
		$processor = new UBCleaningProcessor($cleaning , $update_to, $this->output_file);
		$processor->process();
		if($processor->errored()){
			\Storage::append($this->output_file, "*** CLEANING PROCESSOR OPERATION FAILED. ERROR: " . $processor->get_error() );
			echo "*** CLEANING PROCESSOR OPERATION FAILED. ERROR: " . $processor->get_error();
		} else {
			$cleaning_results = $processor->get_cleaning_results();
			$cleaning_results['cleaning_date'] = $cleaning_results['cleaning_date']->toDateString();
			$cleaning_results['update_to'] = $cleaning_results['update_to']->toDateString();
// echo "UBCLEANING - CLEANING_PUSHING " . json_encode($this->cleaning_results) .PHP_EOL. " AND" .PHP_EOL. json_encode($processor->get_cleaning_results());
			$this->cleaning_results[] = $cleaning_results;
// echo PHP_EOL."=>".PHP_EOL.json_encode($this->cleaning_results);

		}
	}

	public function errored(){
		return !is_null($this->error);
	}
	public function get_error(){
		return $this->error;
	}

	public function get_cleaning_results(){
		return $this->cleaning_results;
	}

	public function get_booking_results(){
		return ['listing_id'=>$this->system_booking->listing_id,
            	'confirmation_code'=>$this->system_booking->confirmation_code,
            	'checkin'=>$this->system_booking->checkin->toDateString(),
            	'checkout'=>$this->system_booking->checkout->toDateString(),
            	'number_of_guests'=>$this->system_booking->guests,
            	'number_of_beds'=>$this->system_booking->beds,
            	'guest_name'=>$this->system_booking->guest_name,
            	'price'=>$this->system_booking->payout_price,
            	'error'=>$this->error,
				'updated'=>$this->updated,
				'created'=>$this->created,];
	}
}
