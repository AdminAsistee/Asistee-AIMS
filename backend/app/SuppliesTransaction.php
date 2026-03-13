<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Scopes\ModelFilter;

/**
 * App\Supply
 *
 * @property int $id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Supply onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereCreatedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereDeletedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereUpdatedAt( $value )
 * @method static \Illuminate\Database\Query\Builder|\App\Supply withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Supply withoutTrashed()
 * @mixin \Eloquent
 * @property int $amount
 * @property string $status
 * @property int $supply_id
 * @property int $cleaning_id
 * @property-read \App\Cleaning $cleaning
 * @property-read \App\Supply $supply
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SuppliesTransaction filter(\App\Scopes\ModelFilter $filter)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SuppliesTransaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SuppliesTransaction whereCleaningId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SuppliesTransaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SuppliesTransaction whereSupplyId($value)
 */
class SuppliesTransaction extends Model {
	use SoftDeletes;

	protected $fillable = [ 'amount', 'supply_id', 'cleaning_id' ];

	protected $with = [ 'supply' ];

	protected function serializeDate( \DateTimeInterface $date ) {
		return $date->format( 'c' );
	}

	public function cleaning() {
		return $this->belongsTo( 'App\Cleaning' );
	}

	public function supply() {
		return $this->belongsTo( 'App\Supply' );
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
