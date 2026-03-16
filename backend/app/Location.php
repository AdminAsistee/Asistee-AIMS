<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Scopes\ModelFilter;

/**
 * App\Location
 *
 * @property int $id
 * @property string $building_name
 * @property int $room_number
 * @property string $address
 * @property float $latitude
 * @property float $longitude
 * @property string $status
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property int $owner_id
 * @property int|null $channel_manager_id
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Cleaning[] $cleanings
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Listing[] $listings
 * @property-read \App\User $owner
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Location onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereAddress( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereBuildingName( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereChannelManagerId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereCreatedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereDeletedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereLatitude( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereLongitude( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereOwnerId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereRoomNumber( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereStatus( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereUpdatedAt( $value )
 * @method static \Illuminate\Database\Query\Builder|\App\Location withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Location withoutTrashed()
 * @mixin \Eloquent
 * @property string $map_link
 * @property string|null $guest_photo_directions_link
 * @property int|null $max_beds
 * @property string $entry_info
 * @property string|null $mail_rules
 * @property string|null $trash_rules
 * @property int|null $default_cleaner
 * @property float $default_staff_cleaning_payout
 * @property float $default_client_charge
 * @property float $per_bed_charge
 * @property float $per_guest_charge
 * @property float|null $SplitRate
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereDefaultCleaner( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereDefaultClientCharge( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereDefaultStaffCleaningPayout( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereEntryInfo( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereGuestPhotoDirectionsLink( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereMailRules( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereMapLink( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereMaxBeds( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location wherePerBedCharge( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location wherePerGuestCharge( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereSplitRate( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereTrashRules( $value )
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\PropertyPhoto[] $photos
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location filter(\App\Scopes\ModelFilter $filter)
 */
class Location extends Model {
	use SoftDeletes;

//	protected $with = ['owner'];

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'building_name',
		'room_number',
		'address',
		'latitude',
		'longitude',
		'owner_id',
		'channel_manager_id',
		'map_link',
		'entry_info',
		'mail_rules',
		'trash_rules',
		'guest_photo_directions_link',
		'max_beds',
		'per_bed_charge',
		'per_guest_charge',
		'SplitRate',
		'default_staff_cleaning_payout',
		'default_client_charge',
		'default_cleaner',
	];

	protected function serializeDate( \DateTimeInterface $date ) {
		return $date->format( 'c' );
	}

	// protected $dates = ['deleted_at'];

	public function owner() {
		return $this->belongsTo( User::class, 'owner_id' ); // Personal Note: Associates Class Type with Column Name
	}

	public function listings() {
		return $this->belongsToMany( 'App\Listing' );
	}
	// public function channel_manager()
	// {
	//     return $this->belongsTo(ChannelManager::class);
	// }
	public function cleanings() {
		return $this->hasMany( 'App\Cleaning' );
	}

	public function photos() {
		return $this->hasMany( PropertyPhoto::class );
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
