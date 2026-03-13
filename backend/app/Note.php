<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Note
 *
 * @property int $id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Note onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Note whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Note whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Note whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Note whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Note withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Note withoutTrashed()
 * @mixin \Eloquent
 * @property string $note_body
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Note whereNoteBody($value)
 */
class Note extends Model
{
    use SoftDeletes;

	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}
}
