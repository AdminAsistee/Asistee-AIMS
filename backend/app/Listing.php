<?php

namespace App;

use App\Scopes\ModelFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Listing
 *
 * @property int $id
 * @property int $channel_account_id
 * @property string $channel_listing_id
 * @property string $status
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Booking[] $bookings
 * @property-read \App\ChannelAccount $channel_account
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Location[] $locations
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Listing onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereChannelAccountId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereChannelListingId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereCreatedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereDeletedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereStatus( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereUpdatedAt( $value )
 * @method static \Illuminate\Database\Query\Builder|\App\Listing withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Listing withoutTrashed()
 * @mixin \Eloquent
 * @property string|null $listing_title
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Listing whereListingTitle($value)
 */
class Listing extends Model {
	use SoftDeletes;
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'channel_account_id',
		'channel_listing_id',
		'listing_title',
		'status',
	];
	public static $field_status = [ 'newly_created', 'active', 'suspended', 'discontinued' ];

	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}

	public function locations() {
		return $this->belongsToMany( 'App\Location' );
	}

	public function bookings() {
		return $this->hasMany( 'App\Booking' );
	}

	public function channel_account() {
		return $this->belongsTo( ChannelAccount::class );
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
