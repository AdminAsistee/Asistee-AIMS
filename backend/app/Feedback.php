<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Feedback
 *
 * @property int $id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Feedback onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Feedback whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Feedback whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Feedback whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Feedback whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Feedback withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Feedback withoutTrashed()
 * @mixin \Eloquent
 */
class Feedback extends Model
{
    use SoftDeletes;
	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}
}
