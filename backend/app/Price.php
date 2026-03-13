<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Price
 *
 * @property int $id
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\Price onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Price withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Price withoutTrashed()
 * @mixin \Eloquent
 * @property string $description
 * @property float $total
 * @property int $percentage
 * @property int|null $parent_id
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Price[] $children
 * @property-read \App\Price|null $parents
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price wherePercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Price whereTotal($value)
 */
class Price extends Model
{
    use SoftDeletes;

    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'description',
		'total',
		'percentage',
		'parent_id',
	];

	// protected $dates = ['deleted_at'];

	// public function booking()
 //    {
 //        return $this->belongsTo(Booking::class);
 //    }

 //    public function cleaning()
 //    {
 //        return $this->belongsTo(Cleaning::class);
 //    }
	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}


	public function parents(){
    	return $this->belongsTo('App\Price','parent_id');
	}

	public function children(){
    	return $this->hasMany('App\Price','parent_id');
	}

}
