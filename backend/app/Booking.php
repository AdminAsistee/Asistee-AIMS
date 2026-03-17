<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Scopes\ModelFilter;

/**
 * App\Booking
 *
 * @property int $id
 * @property int|null $listing_id
 * @property string $checkin
 * @property string $checkout
 * @property string $planned_checkin_time
 * @property string $planned_checkout_time
 * @property int|null $guest_id
 * @property int $guests
 * @property int $beds
 * @property string $status
 * @property int|null $note_id
 * @property int|null $price_id
 * @property int|null $guest_cleaning_feedback_id
 * @property int|null $guest_stay_feedback_id
 * @property int|null $cleaner_feedback_id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \App\Listing|null $listing
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Booking onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereBeds($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereCheckin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereCheckout($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereCleanerFeedbackId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereGuestCleaningFeedbackId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereGuestId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereGuestStayFeedbackId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereGuests($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereListingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereNoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking wherePlannedCheckinTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking wherePlannedCheckoutTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking wherePriceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Booking withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Booking withoutTrashed()
 * @mixin \Eloquent
 * @property string|null $confirmation_code
 * @property-read \App\User|null $guest
 * @property-read \App\Price|null $price
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking whereConfirmationCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Booking filter(\App\Scopes\ModelFilter $filter)
 */
class Booking extends Model
{
	use SoftDeletes;

//	protected $with = ['listing.locations'];

    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */

	protected $fillable = [
		'listing_id',
		'source_channel_account_id',
		'checkin',
		'checkout',
		'planned_checkin_time',
		'planned_checkout_time',
		'guests',
		'beds',
		'confirmation_code',
		'guest_id',
		'price_id',
		'guest_name',
		'payout_price',
	];

    protected $guarded = [];

	protected $dates = [
		'created_at',
		'updated_at',
		'deleted_at',
		'checkin',
		'checkout',
	];

	public static $field_status = ['newly_created', 'pending_arrival', 'cancelled', 'arrived','departed','reviewed','rejected'];

	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}

	public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function guest()
    {
        return $this->belongsTo(User::class);
    }

    public function price()
    {
        return $this->belongsTo(Price::class);
    }

    /**
     * The channel account that sourced this booking (null = manually created).
     */
    public function source_channel_account()
    {
        return $this->belongsTo(\App\ChannelAccount::class, 'source_channel_account_id');
    }

    public static function overlaps(Listing $listing,$checkin,$checkout){
		$overlappingBookings = $listing->locations
			->map(function($location) { return $location->listings;})->unique()->flatten()
		 	->map(function($listing) use ($checkout,$checkin){ return
		 		Booking::where('listing_id',$listing->id)
		 		// $listing->bookings // TODO: WRITE TEST FOR THIS<< - Model works, collection doesn't because carbon database type.
				->where('checkin','<',$checkout)
				->where('checkout','>',$checkin);})->unique()->flatten();

// die("Listing: ".$listing->id." | checkin: " . $checkin . " | checkout: " . $checkout . " | Outcome_count: " . $overlappingBookings[0]->count() . " | Outcome: " . json_encode($overlappingBookings[0]->get()));

		 return ($overlappingBookings[0]->count() > 0);
		// if($overlappingBookings->count() > 0){
		// 	return true;
		// } else {
		// 	return false;
		// }
	}

	/**
	 * @param Builder $query
	 * @param ModelFilter $filter
	 *
	 * @return Builder
	 */
	public function scopeFilter( Builder $query, ModelFilter $filter ) {
		return $filter->apply( $query );
	}
}
