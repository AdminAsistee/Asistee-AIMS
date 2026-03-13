<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\ExtraService
 *
 * @property int $id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\ExtraService onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExtraService whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExtraService whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExtraService whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExtraService whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ExtraService withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\ExtraService withoutTrashed()
 * @mixin \Eloquent
 */
class ExtraService extends Model
{
    use SoftDeletes;
	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}
}
