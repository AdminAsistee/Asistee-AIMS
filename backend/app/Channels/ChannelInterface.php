<?php

namespace App\Channels;

interface ChannelInterface
{
	// returns the latest error, which initializes as null
	public function getError();
	// get the raw response from the API call
	public function getRawResponse();
	// get the decoded, easily processable array/object with info.
	public function getDecodedResponse();
	// Process the url after setting the Variables
	public function process($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient);
	// get the pulled set of bookings
	public function getBookings($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient);
	//
	public function getAvailableDates($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient);
	//
	public function getBlockedDates($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient);
	//
	public function getDateDefinitions($listing_channel_id,$date1,$date2,$authenticaitonParameters,$guzzlehttpClient);
	// Set a date to blocked (meaning unavailable to be booked)
	public function setDateBlocked($listing_channel_id,$date,$note,$authenticaitonParameters,$guzzlehttpClient);
	// Set a date to be available to be booked
	public function setDateAvailable($listing_channel_id,$date,$authenticaitonParameters,$guzzlehttpClient);
	// Set the price of an available day
	public function setPrice($listing_channel_id,$date,$authenticaitonParameters,$guzzlehttpClient);
	// Send a message to the booking's message queue
	public function sendMessage($booking_id,$authenticaitonParameters,$guzzlehttpClient);
	// get details of a listing
	public function getListingDetails($listing_channel_id,$authenticaitonParameters,$guzzlehttpClient);
}