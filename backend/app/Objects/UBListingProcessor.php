<?php

namespace App\Objects;

use App\Listing;
use App\Channels\ChannelAbstract;
use App\Objects\UBBookingProcessor;

class UBListingProcessor {
	public $listing;
	public $bookings;
	public $error;
	public $cleaning_results;
	public $booking_results;
	public $output_file;

	/**
	 * UBListingProcessor constructor.
	 *
	 * @param $data
	 */
	public function __construct( $listing,$output_file="" ) {
		$this->listing = $listing;
		$this->bookings = null;
		$this->error = null;
		$this->cleaning_results = [];
		$this->booking_results = [];
		$this->client = new \GuzzleHttp\Client();
		$this->output_file = $output_file;
	}

	/**
	 * Perform the Draw and Update Booking root logic.
	 *
	 * @return $this
	 */
	public function process($date1=false,$date2=false){
		$date1 = $date1 ? \Carbon\Carbon::createFromFormat('Y-m-d', $date1)->subDay()->toDateString() : \Carbon\Carbon::today()->subDay()->toDateString();
		$date2 = $date2 ? \Carbon\Carbon::createFromFormat('Y-m-d', $date2)->toDateString() : \Carbon\Carbon::createFromFormat('Y-m-d', $date1)->addDays(30)->toDateString();

		$listing_instance = Listing::findOrFail($this->listing->id);
		
		$channelObject = ChannelAbstract::getChannelObject($listing_instance->channel_account->channel_id);

        $listing_channel_id=$listing_instance->channel_listing_id;
        try {
            $authenticaitonParameters = decrypt($listing_instance->channel_account->authentication_token);
        } catch (DecryptException $e) {
            $this->error = 'Failed to decrypt authentication parameters for listing [' . $listing_instance->id . ']'. PHP_EOL;
            return false; 
        }
        $processed = $channelObject->process($listing_channel_id,$date1,$date2,$authenticaitonParameters,$this->client);
        // skip if error
        if(!$processed){
            $this->error = 'Listing [' . $listing_instance->id . ']\'s ChannelObject received the following error calling getDateDefinitions: [' . json_encode($channelObject->getError()) . '] ... Skipping'. PHP_EOL;
            return false; 
        }
// Draw done. 
// For each booking, check if exists
        // $this->info('Location [' . $listing_instance->id . ']\'s drew [' . count($channelObject->bookings_data) . '] bookings.'. PHP_EOL);
        $this->bookings = $channelObject->getBookings();
\Storage::append($this->output_file, PHP_EOL."vvvvv PROCESSING-LISTING[".$this->listing->id."]-BOOKINGS(".count($this->bookings).") [".$date1." => ".$date2."]vvvvv".PHP_EOL );
        foreach ($this->bookings as $booking) {
        	$booking['listing_id'] = $this->listing->id;
// echo "BOOKING : " . ;
        	$processor = new UBBookingProcessor($booking,$this->output_file);
			$processor->process();
			if($processor->errored()){
				\Storage::append($this->output_file, "*** BOOKING PROCESSOR FAILED. ERROR: " . $processor->get_error() );
				echo "*** BOOKING PROCESSOR FAILED. ERROR: " . $processor->get_error();
			} else {
// echo "UBLISTING - CLEANING_MERGING " . json_encode($this->cleaning_results) .PHP_EOL. " AND" .PHP_EOL. json_encode($processor->get_cleaning_results());
				$this->cleaning_results = array_merge($this->cleaning_results,$processor->get_cleaning_results());
// echo PHP_EOL."=>".PHP_EOL.json_encode($this->cleaning_results);

// echo "UBLISTING - BOOKING_MERGING " . json_encode($this->booking_results) . " AND" . json_encode($processor->get_booking_results());
				$this->booking_results[] = $processor->get_booking_results();
// echo PHP_EOL."=>".PHP_EOL.json_encode($this->booking_results);
			}
			
        }
	}

	public function get_cleaning_results(){
		return $this->cleaning_results;
	}
	public function get_booking_results(){
		return $this->booking_results;
	}

	public function errored(){
		return !is_null($this->error);
	}
	public function get_error(){
		return $this->error;
	}
}
