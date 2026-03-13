<?php

namespace App\Channels;

use ICal\ICal as ICAL_Parser;

class ICAL extends ChannelAbstract 
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
	}

	public function getBookings($listing_channel_id=null,$date1=null,$date2=null,$authenticaitonParameters=null,$guzzlehttpClient=null)
	{
		return $this->bookings_data;
	}

	public function process($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient){
		$responseBody = $this->getDateDefinitions($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient);
		if(!$this->getError()){
			return true;
		} else {
			return false;
		}
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

		$res = $guzzlehttpClient->request('GET', $listing_channel_id);

		// Legacy code
		// $json = file_get_contents('https://www.airbnb.com/calendar/ical/6806517.ics?s=12f29f637eadc090333ec5dee10c3fe0', false, stream_context_create(array('http'=>array('method'=>"GET","header" => "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36\r\n"))));
		// if($res->getStatusCode() == 403){$this->error_message = [
		// 	'message'=>'Unauthorized : API Key Invalid. Please re-connect your Airbnb Account.',
		// 	'status_code'=>$res->getStatusCode(),
		// 	'body'=>$res->getBody()->getContents(),
		// 	];
		// 	// TODO : send email or special flag asking for client re-verification.
		// 	return false;
		// }

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

		$json = $res->getBody()->getContents();
		if(strlen($json) == 0){
			$this->error_message = [
				'message'=>'URL_request_zero_length error'
			];
    		return false;
		}
		$this->bookings_data = $json;
		$this->raw_response = $json;
		try {
		    $ical = new ICAL_Parser($json, array(
		        'defaultSpan'                 => 2,     // Default value
		        'defaultTimeZone'             => 'UTC',
		        'defaultWeekStart'            => 'MO',  // Default value
		        'disableCharacterReplacement' => false, // Default value
		        'skipRecurrence'              => false, // Default value
		        'useTimeZoneWithRRules'       => false, // Default value
		    ));
		} catch (\Exception $e) {
			$this->error_message = [
				'message'=>'ical_object_creation error',
				'exception'=>$e
			];
    		return false;
		}

		$begin = \Carbon\Carbon::createFromFormat('Y-m-d', $date1);
		$end = \Carbon\Carbon::createFromFormat('Y-m-d', $date2);
		// // $begin = \Carbon\Carbon::now()->subDays(1);
		// $end = $begin->copy()->addDays(30);
		

		// die("STARTING: [" . $begin->toDateString() . "] ENDING: [" . $end->toDateString() . "]");
		$events = $ical->eventsFromRange($begin->toDateString(),$end->toDateString());
		$forceTimeZone = false;
		$this->bookings_data = [];
		if($ical->eventCount == 0){
			$this->error_message = [
				'message'=>'malformed_or_zero_events error'
			];
    		return false;
		}
		foreach ($events as $event){
			if($event->summary == "Not available"){continue;}
			$dtstart = $ical->iCalDateToDateTime($event->dtstart_array[3], $forceTimeZone);
			$dtend = $ical->iCalDateToDateTime($event->dtend_array[3], $forceTimeZone);
			 
			$pos = strpos($event->summary, "(");
			// strlen($event->summary)-2
			$confirmation_code = rtrim(substr($event->summary, $pos+1),")");
			$guest_name = substr($event->summary, 0, $pos-1);
			if(!$confirmation_code){
				$confirmation_code = $event->summary;
				$guest_name = $event->summary;
			}
			$this->bookings_data[] = ['confirmation_code'=>$confirmation_code,
					'guest_name'=>$guest_name,
					'checkin'=>$dtstart->format('Y-m-d'),
					'checkout'=>$dtend->format('Y-m-d'),
					'number_of_guests'=>0, // Locations default
					'number_of_beds'=>0, //round($Guests/2),
					'message_thread_id'=>null,
					'price'=>null];
		}

		return true;









		// $data_string = '{"operations":[{"method":"GET","path":"/calendar_days","query":{"start_date":"'.$date1.'","listing_id":"'.$listing_channel_id.'","_format":"host_calendar","end_date":"'.$date2.'"}}],"_transaction":false}';

		// $res = $guzzlehttpClient->request('POST', "https://api.airbnb.com/v2/batch/?locale=en&currency=JPY",[
		//     'headers' => [
		//         'X-Airbnb-OAuth-Token' => $authenticaitonParameters,
		//         'Content-Type'     => 'application/json',
		//         'charset'      => 'UTF-8',
		//     ],
		//     'body' => $data_string,
		// 	'http_errors' => false,
		// ]);
		// // invalid API call catch
		// if($res->getStatusCode() == 401){$this->error_message = [
		// 	'message'=>'Unauthorized : API Key Invalid. Please re-connect your Airbnb Account.',
		// 	'status_code'=>$res->getStatusCode(),
		// 	'body'=>$res->getBody()->getContents(),
		// 	];
		// 	// TODO : send email or special flag asking for client re-verification.
		// 	return false;
		// }
		// // incorrect status code error catch, 
		// if($res->getStatusCode() != 200){$this->error_message = [
		// 	'message'=>'incorrect response status code',
		// 	'status_code'=>$res->getStatusCode(),
		// 	'body'=>$res->getBody()->getContents(),
		// 	];
		// 	// Maybe factor out IncorrectResponseCode Exception or something with default handler. 
		// 	// Maybe send email or special flag.
		// 	return false;
		// }
		// // store the contents of the return of the request.
		// $this->raw_response = $res->getBody()->getContents();
		// // zero length error part 1 catch: if the response itself is empty
		// if(!($this->raw_response)){$this->error_message = ['message'=>'zero length response'];return false;}
		// // decode the response into array manipulatable data.
		// $this->decoded_response = json_decode($this->raw_response,true);
		// // json error catch - fail if there was a failure in json decoding.
		// if(json_last_error() != JSON_ERROR_NONE) {
		// 	$this->error_message = [
		// 		'message'=>'json_decode error',
		// 		'json_error'=>json_last_error()
		// 	];
  //   		return false;
  //   	}
  //   	// Zero length error part 2 catch: if a correctly encoded json contains no data
  //   	if(count($this->decoded_response) == 0){$this->error_message = ['message'=>'zero length json response'];return false;}

  //   	// TODO: last catches : invalid api key errors, account suspended errors , etc. etc.

  //   	return true;

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

	public function getError(){return $this->error_message;}
	public function getRawResponse(){return $this->raw_response;}
	public function getDecodedResponse(){return $this->decoded_response;}

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
	

}
