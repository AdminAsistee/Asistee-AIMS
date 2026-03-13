<?php

// Name is Channel, but should probably be a separate logic entirely.
// Not sure if channel management object should exist.

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Channels\ChannelAbstract;
use GuzzleHttp\Client;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Listing;
use App\Booking;
use App\User;
use App\Price;

class ChannelController extends Controller
{
	/**
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function index( Request $request , Listing $listing ) {

		$channelObject = ChannelAbstract::getChannelObject($listing->channel_account->channel_id);

	/////////////////////////////////////////////////////////
		// $l = $listing_channel_id=$listing->channel_listing_id;
		// $date1 = '';
		// $date2 = '';
		// $authenticaitonParameters = '';
		// $client = new \GuzzleHttp\Client();

		// $processed = $channelObject->process($l,$date1,$date2,$authenticaitonParameters,$client);

		// die(json_encode($channelObject->getBookings(), JSON_UNESCAPED_UNICODE));

	/////////////////////////////////////////////////////////
		$default_interval = 30;
		$date1=isset($request->all()['date1']) ? $request->all()['date1'] : date("Y-m-d");
		$date2=isset($request->all()['date2']) ? $request->all()['date2'] : date('Y-m-d', strtotime($date1 . ' +' . $default_interval . ' day'));
		$listing_channel_id=$listing->channel_listing_id;
		try {
		    $authenticaitonParameters = decrypt($listing->channel_account->authentication_token);
		} catch (DecryptException $e) {
		    return response( ['error'=>[
		    	'message'=>'Could not decrypt authenitcation information.',
		    ]], 512 );
		}
		

		$return_common = ['listing'=>$listing,
			'start_date'=>$date1,
			'end_date'=>$date2,];

		// return response( ['DEBUG'=>["date1"=>$date1,"date2"=>$date2,"listing_channel_id"=>$listing_channel_id,"authenticaitonParameters"=>$authenticaitonParameters]], 200 );
		$client = new \GuzzleHttp\Client();
		
    	$processed = $channelObject->process($listing_channel_id,$date1,$date2,$authenticaitonParameters,$client);
    	// primaryInfo = List of Dates!! 
		return response( array_merge($return_common,[
			'raw_return'=>$channelObject->getRawResponse(),
			'decoded_return'=>$channelObject->getDecodedResponse(),
			'parsed_bookings'=>$channelObject->getBookings(),
			'error_message'=>$channelObject->getError(),
		]), 200 );	

	}


	public function pullCleanings( Request $request ){

		$date_interest=isset($request->all()['date']) ? $request->all()['date'] : date("Y-m-d");
		$date = \Carbon\Carbon::createFromFormat('Y-m-d', $date_interest)->subDay()->toDateString();

		$listings_list = Listing::all();
		$client = new \GuzzleHttp\Client();
		$listing_checkouts = $listings_list->map(function($listing) use ($client,$date,$date_interest) {
			$channelObject = ChannelAbstract::getChannelObject($listing->channel_account->channel_id);
			$listing_channel_id=$listing->channel_listing_id;
			try {
			    $authenticaitonParameters = decrypt($listing->channel_account->authentication_token);
			} catch (DecryptException $e) {
			    return; 
			    // response( ['error'=>[
			    // 	'message'=>'Could not decrypt authenitcation information.',
			    // ]], 512 );
			}

			$processed = $channelObject->process($listing_channel_id,$date,$date,$authenticaitonParameters,$client);
			if($processed){
				$cleaning_objects=[];
				if(count($channelObject->getBookings()) == 0){return false;}
				// Change from zeroth to collect->pluck->contains
				// if($channelObject->getBookings()[0]['checkout'] == $date_interest){
					$cleaning_objects = $listing->locations->map(function($location) use ($channelObject){
						return [
							'location'=>$location->building_name . ' ' . $location->room_number,
							'checkout'=>$channelObject->getBookings()//[0]['checkout']
						];
					});
				// }

				return $cleaning_objects;
				// array_column($channelObject->bookings_data, 'checkout');
			}
return false;
			
		});

		return response(['date'=>$date_interest,
			'checkout_dates'=>$listing_checkouts,
	],200);
	}


}
