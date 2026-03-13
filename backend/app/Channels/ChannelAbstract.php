<?php

namespace App\Channels;
// use GuzzleHttp\Client;

abstract class ChannelAbstract implements ChannelInterface
{
	public static function getChannelObject($id){
		switch ($id) {
			case 1:
				return new Airbnb();
				break;

			case 2:
				return new ICAL(); // new BookingDotCom();
				break;

			// ... So on and so forth

			default:
				return false; //new ICAL();
				break;
		}
	}
}