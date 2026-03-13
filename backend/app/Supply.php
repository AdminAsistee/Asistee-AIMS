<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
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
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Supply withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Supply withoutTrashed()
 * @mixin \Eloquent
 * @property string $name
 * @property int $ready_stock
 * @property int $in_use_stock
 * @property int $in_maintenance_stock
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply filter(\App\Scopes\ModelFilter $filter)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereInMaintenanceStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereInUseStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Supply whereReadyStock($value)
 */
class Supply extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'ready_stock', 'in_use_stock','in_maintenance_stock'];

	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
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
