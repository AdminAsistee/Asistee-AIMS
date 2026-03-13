<?php

namespace App\Channels;

class Airbnb extends ChannelAbstract 
{ 
	private $raw_response;
	private $decoded_response;
	private $error_message;

	public function __construct(){
		$this->raw_response = null;
		$this->decoded_response = null;
		$this->error_message = null;
		$this->bookings_data = null;
		$this->statistics = null;
		$this->first_look = true;
		$this->current_date = null;
	}

	public function getError(){return $this->error_message;}
	public function getRawResponse(){return $this->raw_response;}
	public function getDecodedResponse(){return $this->decoded_response;}

	public function process($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient){
		$responseBody = $this->getDateDefinitions($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient);
		if(!$this->getError()){
			$this->processBookingsFromDays();
			return true;
		} else {
			return false;
		}
	}

	public function getBookings($listing_channel_id=null,$date1=null,$date2=null,$authenticaitonParameters=null,$guzzlehttpClient=null)
	{
		return $this->bookings_data;
	}

	public function getAvailableDates($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient)
	{

	}

	public function getBlockedDates($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient)
	{

	}
	// guzzleHttpClient being passed in = Dependency Injection for testing.
	// design possibilities: 1. Move listing_channel_id into object field.
	// 2. Make Auth params obtained internally
	public function getDateDefinitions($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient)
	{

		$data_string = '{"operations":[{"method":"GET","path":"/calendar_days","query":{"start_date":"'.$date1.'","listing_id":"'.$listing_channel_id.'","_format":"host_calendar","end_date":"'.$date2.'"}}],"_transaction":false}';

		$res = $guzzlehttpClient->request('POST', "https://api.airbnb.com/v2/batch/?locale=en&currency=JPY",[
		    'headers' => [
		        'X-Airbnb-OAuth-Token' => $authenticaitonParameters,
		        'Content-Type'     => 'application/json',
		        'charset'      => 'UTF-8',
		    ],
		    'body' => $data_string,
			'http_errors' => false,
		]);
		// invalid API call catch
		if($res->getStatusCode() == 401){$this->error_message = [
			'message'=>'Unauthorized : API Key Invalid. Please re-connect your Airbnb Account.',
			'status_code'=>$res->getStatusCode(),
			'body'=>$res->getBody()->getContents(),
			];
			// TODO : send email or special flag asking for client re-verification.
			return false;
		}
		// incorrect status code error catch, 
		if($res->getStatusCode() != 200){$this->error_message = [
			'message'=>'incorrect response status code',
			'status_code'=>$res->getStatusCode(),
			'body'=>$res->getBody()->getContents(),
			];
			// Maybe factor out IncorrectResponseCode Exception or something with default handler. 
			// Maybe send email or special flag.
			return false;
		}
		// store the contents of the return of the request.
		$this->raw_response = $res->getBody()->getContents();
		// zero length error part 1 catch: if the response itself is empty
		if(!($this->raw_response)){$this->error_message = ['message'=>'zero length response'];return false;}
		// decode the response into array manipulatable data.
		$this->decoded_response = json_decode($this->raw_response,true);
		// json error catch - fail if there was a failure in json decoding.
		if(json_last_error() != JSON_ERROR_NONE) {
			$this->error_message = [
				'message'=>'json_decode error',
				'json_error'=>json_last_error()
			];
    		return false;
    	}
    	// Zero length error part 2 catch: if a correctly encoded json contains no data
    	if(count($this->decoded_response) == 0){$this->error_message = ['message'=>'zero length json response'];return false;}

    	// TODO: last catches : invalid api key errors, account suspended errors , etc. etc.

    	return true;

// Legacy Version from old system
	// 	$remote_url = "https://api.airbnb.com/v2/batch/?locale=en&currency=JPY";
	    // $DataString = '{"operations":[{"method":"GET","path":"/calendar_days","query":{"start_date":"'.$date1.'","listing_id":"'.$listing_channel_id.'","_format":"host_calendar","end_date":"'.$date2.'"}}],"_transaction":false}';
	//     $curl_handle=curl_init();
	//     curl_setopt($curl_handle, CURLOPT_URL,$remote_url);
	//     curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
	//     curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
	//     curl_setopt($curl_handle, CURLOPT_HTTPHEADER, array('X-Airbnb-OAuth-Token: '. getAuthTokenFromAirbnbAccount(getAirbnbAccountFromListingID($ListingID)),'Content-Type: application/json','charset=UTF-8')); 
	    // $listing->channel->get$listing_channel_id
	//     curl_setopt($curl_handle,CURLOPT_POST, 1);
	//     curl_setopt($curl_handle,CURLOPT_POSTFIELDS, $DataString);
	//     $results = curl_exec($curl_handle);
	//     curl_close($curl_handle);
	//     return $results;
	}

	public function setDateBlocked($listing_channel_id,$date,$note,$authenticaitonParameters,$guzzlehttpClient)
	{

	}

	public function setDateAvailable($listing_channel_id,$date,$authenticaitonParameters,$guzzlehttpClient)
	{

	}

	public function setPrice($listing_channel_id,$date,$authenticaitonParameters,$guzzlehttpClient)
	{

	}

	public function sendMessage($booking_id,$authenticaitonParameters,$guzzlehttpClient)
	{

	}

	public function getListingDetails($listing_channel_id,$authenticaitonParameters,$guzzlehttpClient)
	{

	}

	public function processBookingsFromDays(){
		if (!(isset($this->decoded_response)
			&& isset($this->decoded_response['operations'])
			&& isset($this->decoded_response['operations'][0])
			&& isset($this->decoded_response['operations'][0]['response'])
			&& isset($this->decoded_response['operations'][0]['response']['calendar_days']))){return false;}
		$days_data = $this->decoded_response['operations'][0]['response']['calendar_days'];
		$this->bookings_data = [];
		for ($i=0; $i < count($days_data); $i++) { 
			if($i == 1){$this->first_look = false;}
			// $this->bookings_data[] = $days_data[$i];continue;
			$day_data = $days_data[$i];
			// if available, no reservation data.
			if($days_data[$i]['available']){continue;}

			$date = $day_data['date'];
			$this->current_date = $date;
			$notes = $day_data['notes'];

			if($day_data['reservation']){
				$confirmationCode = $day_data['reservation']['confirmation_code'];
				$nights = $day_data['reservation']['nights'];
				$checkinDate = $day_data['reservation']['start_date'];
				$checkoutDate = date('Y-m-d', strtotime($checkinDate . ' +' . $nights . ' day'));
				$Guests = $day_data['reservation']['number_of_guests'];
				$GuestName = isset($day_data['reservation']['guest']['full_name']) ? $day_data['reservation']['guest']['full_name'] : "Airbnb_Guest_name_not_set";
				$Price = $day_data['reservation']['localized_payout_price']; //???
				$messageThreadID = $day_data['reservation']['thread_id'];
				$Status = $day_data['reservation']['status'];
				// TODO : make into function that 
				$this->bookings_data[] = ['confirmation_code'=>$confirmationCode,
					'guest_name'=>$GuestName,
					'checkin'=>$checkinDate,
					'checkout'=>$checkoutDate,
					'number_of_guests'=>$Guests,
					'number_of_beds'=>round($Guests/2),
					'message_thread_id'=>$messageThreadID,
					'price'=>$Price,
				];
				// skipping forward
				if($this->validateDate($checkoutDate) && $this->validateDate($date) && ($this->getTimeBetweenDates($checkoutDate,$date) > 1)){
					$i += ($this->getTimeBetweenDates($checkoutDate,$date) - 1);
				}
			} else if($day_data['external_calendar']){

				$note = $day_data['external_calendar']['notes'];
				$external_calendar_data = $this->ParseExternalCalendarNote($note);
				if($external_calendar_data){
					$this->bookings_data[] = $external_calendar_data;
					// skipping forward
					if($this->validateDate($external_calendar_data['checkout']) && $this->validateDate($date) && ($this->getTimeBetweenDates($external_calendar_data['checkout'],$date) > 1)){
						$i += ($this->getTimeBetweenDates($external_calendar_data['checkout'],$date) - 1);
					}
				}
				// TODO : else here can report error in external calendar parsing.
			} else {
				// Legitimately manually blocked dates.
				// TODO : default structure is make bookings for everything. Check option to not to.
				// = construction logic.
			}

		}
		return true;
	}

	/**
	*
	*  Private Functions from previous implementation.
	*
	*/
	private function validateDate($str){
		return ((($timestamp = strtotime($str)) === false) ? false : true) ;
	}
	private function getTimeBetweenDates($d1,$d2){
	    $date1 = strtotime($d1);
	    $date2 = strtotime($d2);
	    $datediff = $date1 - $date2;
	    return floor($datediff / (60 * 60 * 24));
	}
	private function ParseExternalCalendarNote($String){
        // echo "\nATTEMPTING TO PARSE STRING FOR INFO: \n[$string]\n";
        if (strpos($String, 'Not avaliable') !== false) {
            // echo  "NOT AVAILABLE DATA FOUND\n";
            return false;
        }
        //
        $confirmation_code=null;
        preg_match_all('/CHECKIN: *([0-9]{4}([-\/_]?[0-9]{2}){2}|([0-9]{2}[-\/_]?){2}[0-9]{4})/i', $String, $CheckinArray);
        preg_match_all('/CHECKOUT: *([0-9]{4}([-\/_]?[0-9]{2}){2}|([0-9]{2}[-\/_]?){2}[0-9]{4})/i', $String, $CheckoutArray);
        preg_match_all('/(GUESTS|PERSON): *[0-9]+/i', $String, $GuestsArray);
        preg_match_all('/[^0-9\n!.,:\r\n]*?\([a-zA-Z0-9]*\)/', $String, $GuestNameWithIDArray);
        $checkinDate = isset($CheckinArray[0][0]) ? date("Y-m-d",strtotime(trim(substr($CheckinArray[0][0],strpos($CheckinArray[0][0],":")+1), " "))) : false;
        $checkoutDate = isset($CheckoutArray[0][0]) ? date("Y-m-d",strtotime(trim(substr($CheckoutArray[0][0],strpos($CheckoutArray[0][0],":")+1), " "))) : false;
        $Guests = isset($GuestsArray[0][0]) ? substr($GuestsArray[0][0],strpos($GuestsArray[0][0],":")+1) : 0;
        $GuestName = isset($GuestNameWithIDArray[0][0]) ? $GuestNameWithIDArray[0][0] : "";
        $strEnd = strpos($GuestName,")");
        $strStart = strpos($GuestName,"(")+1;

        if($strStart > 0 && $strEnd > $strStart){
        	$confirmation_code = substr($GuestName,$strStart,$strEnd-$strStart);
        	$GuestName = trim(substr($GuestName,0,$strStart-1));
        }

        if($confirmation_code == "bookingcom"){
        	return $this->handle_booking_com($String,['confirmation_code' => $confirmation_code,
        	'guest_name' => $GuestName,
        	'number_of_guests' => (int)$Guests,
        	'number_of_beds'=>(int)round($Guests/2)]);
        }

        // if(!($checkinDate && $checkoutDate)) {
        // 	return false;
        // }
        if(!($this->validateDate($checkinDate) && $this->validateDate($checkoutDate))){
            // echo  "FAILED TO VALIDATE CHECKIN($checkinDate) OR CHECKOUT($checkoutDate)\n";
            return false;
        }
        if(($checkinDate == $checkoutDate) &&  ($checkoutDate == '1970-01-01')){
            return false;//array('Construction' => 1 );
        }

        return array('confirmation_code' => $confirmation_code,
        	'guest_name' => $GuestName,
        	'checkin' => $checkinDate,
        	'checkout' => $checkoutDate,
        	'number_of_guests' => (int)$Guests,
        	'number_of_beds'=>(int)round($Guests/2),
        	'message_thread_id'=>null,
        	'price' => null );
    }

    private function handle_booking_com($string,$data){
    	if($this->first_look){ return false; }

    	preg_match_all('/NIGHTS: *[0-9]+/i', $string, $NightsArray);
    	preg_match_all('/SUM: *[0-9]+/i', $string, $PricesArray);

    	$nights = isset($NightsArray[0][0]) ? substr($NightsArray[0][0],strpos($NightsArray[0][0],":")+1) : 0;
    	$price = isset($PricesArray[0][0]) ? substr($PricesArray[0][0],strpos($PricesArray[0][0],":")+1) : 0;
    	$confirmation_code = $this->current_date.$data['guest_name'];
    	$checkinDate = $this->current_date;
    	$checkoutDate = date('Y-m-d', strtotime($checkinDate . ' +' . $nights . ' day'));

    	return ['confirmation_code' => $confirmation_code,
        	'guest_name' => $data['guest_name'],
        	'checkin' => $checkinDate,
        	'checkout' => $checkoutDate,
        	'number_of_guests' => $data['number_of_guests'],
        	'number_of_beds'=>$data['number_of_beds'],
        	'message_thread_id'=>null,
        	'price' => (int)$price];
    }

}
