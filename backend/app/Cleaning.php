<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Scopes\ModelFilter;

/**
 * App\Cleaning
 *
 * @property int $id
 * @property int $location_id
 * @property string|null $cleaning_date
 * @property int|null $cleaner_id
 * @property string $status
 * @property int|null $price_id
 * @property int|null $note_id
 * @property string|null $start_time
 * @property string|null $end_time
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \App\User|null $cleaner
 * @property-read \App\Location $location
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Cleaning onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereCleanerId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereCleaningDate( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereCreatedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereDeletedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereEndTime( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereLocationId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereNoteId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning wherePriceId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereStartTime( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereStatus( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereUpdatedAt( $value )
 * @method static \Illuminate\Database\Query\Builder|\App\Cleaning withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Cleaning withoutTrashed()
 * @mixin \Eloquent
 * @property int|null $staff_payout_price_id
 * @property int|null $client_charge_price_id
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereClientChargePriceId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning whereStaffPayoutPriceId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cleaning filter( \App\Scopes\ModelFilter $filter )
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\SuppliesTransaction[] $supplies
 */
class Cleaning extends Model {
	use SoftDeletes;

//	protected $with = ['location','cleaner'];

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'location_id',
		'cleaning_date',
		'cleaner_id',
		'price_id',
		'note_id',
		'start_time',
		'end_time',
	];

	protected function serializeDate( \DateTimeInterface $date ) {
		return $date->format( 'c' );
	}

	public function location() {
		return $this->belongsTo( Location::class );
	}

	public function cleaner() {
		return $this->belongsTo( User::class, 'cleaner_id' ); // Personal Note: Associates Class Type with Column Name
	}

	public function supplies() {
		return $this->hasMany( SuppliesTransaction::class );
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
