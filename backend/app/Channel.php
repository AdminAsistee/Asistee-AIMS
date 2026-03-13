<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// Interface:
// @method isNull | default false
// @method 

/**
 * App\Channel
 *
 * @property int $id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Channel onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Channel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Channel whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Channel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Channel whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Channel withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Channel withoutTrashed()
 * @mixin \Eloquent
 */
class Channel extends Model
{
	use SoftDeletes;

	// public static function getChannelInstance($channel_id){
	// 	switch ($channel_id) {
	// 		case 1:
	// 			return new ManualChannel();
	// 			break;
	// 		case 2:
	// 			return new AirbnbChannel();
	// 			break;
	// 		case 2:
	// 			return new ICALChannel();
	// 			break;
	// 		case 2:
	// 			return new BookingDotComChannel();
	// 			break;
	// 		default:
	// 			return new NullChannel();
	// 			break;
	// 	}
	// }

	// /////////////////////////////////////// vv These 3 could be gotten by each day
 //    protected function getBookings(){

 //    }

 //    protected function getBlockedDays(){
    	
 //    }

 //    protected function getOpenDays(){
    	
 //    }
 //    /////////////////////////////////////// ^^


 //    protected function blockDates(){
    	
 //    }
 //    protected function makeDatesAvailable(){
    	
 //    }

 //    protected function addNote(){ // < can even do this this way? 
    	
 //    }
 //    // For booking platform use
 //    protected function createNewBooking(){
    	
 //    }
 //    protected function cancelBooking(){
    	
    // }
}
