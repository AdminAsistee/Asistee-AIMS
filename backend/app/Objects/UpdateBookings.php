<?php

namespace App\Objects;

use App\Listing;
use App\Objects\UBListingProcessor;

class UpdateBookings {
	public $listings;
	public $date1;
	public $date2;
	public $booking_results;
	public $cleaning_results;
	public $output_file;

	/**
	 * TestMail constructor.
	 *
	 * @param $data
	 */
	public function __construct( $listings, $date1, $date2,$output_file="") {
		$this->listings = is_array($listings) ? collect($listings)->map(function($listing){
            return Listing::find($listing);
        })->filter(function ($thing) {
            return !empty($thing);
        }) : Listing::all();
		$this->date1 = $date1;
		$this->date2 = $date2;
		$this->booking_results = [];
		$this->cleaning_results = [];
		$this->output_file = $output_file;
	}

	/**
	 * Perform the Draw and Update Booking root logic.
	 *
	 * @return $this
	 */
	public function start(){
		for ($i=0; $i < count($this->listings); $i++) {
			$processor = new UBListingProcessor($this->listings[$i],$this->output_file);
			$processor->process($this->date1,$this->date2);
			if($processor->errored()){
				\Storage::append($this->output_file, "*** LISTING PROCESSOR FAILED. ERROR: " . $processor->get_error() );
				echo "*** LISTING PROCESSOR FAILED. ERROR: " . $processor->get_error();
			} else {
// echo "UPDATE_BOOKINGS - CLEANING_MERGING " . json_encode($this->cleaning_results) .PHP_EOL. " AND" .PHP_EOL. json_encode($processor->get_cleaning_results());
				$this->cleaning_results = array_merge($this->cleaning_results,$processor->get_cleaning_results());
// echo PHP_EOL."=>".PHP_EOL.json_encode($this->cleaning_results);

// echo "UPDATE_BOOKINGS - BOOKING_MERGING " . json_encode($this->booking_results) . " AND" . json_encode($processor->get_booking_results());
				$this->booking_results = array_merge($this->booking_results,$processor->get_booking_results());
// echo PHP_EOL."=>".PHP_EOL.json_encode($this->booking_results);
			}
		}

		return true;
	}

	public function get_cleaning_results(){
		return $this->cleaning_results;
	}

	public function get_booking_results(){
		return $this->booking_results;
	}
}
