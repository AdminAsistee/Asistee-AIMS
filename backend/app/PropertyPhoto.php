<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\PropertyPhoto
 *
 * @property int $id
 * @property string $full_path
 * @property string $thumb_path
 * @property string $type
 * @property string $name
 * @property int $location_id
 * @property int $user_id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \App\Location $location
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\PropertyPhoto onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereCreatedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereDeletedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereFullPath( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereLocationId( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereName( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereThumbPath( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereType( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereUpdatedAt( $value )
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PropertyPhoto whereUserId( $value )
 * @method static \Illuminate\Database\Query\Builder|\App\PropertyPhoto withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\PropertyPhoto withoutTrashed()
 * @mixin \Eloquent
 */
class PropertyPhoto extends Model {
	use SoftDeletes;

	/**
	 * Photos are stored in public/uploads/photos/{id}/ and served directly.
	 * No Storage::url() accessor needed — raw path is returned as-is.
	 */
	protected $fillable = ['full_path', 'thumb_path', 'type', 'name', 'location_id', 'user_id'];

	public function location() {
		return $this->belongsTo( Location::class );
	}
}
