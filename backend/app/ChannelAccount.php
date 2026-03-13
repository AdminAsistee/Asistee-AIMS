<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\ChannelAccount
 *
 * @property int $id
 * @property string $description
 * @property int $channel_id
 * @property string|null $authentication_token
 * @property string|null $authentication_information
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Listing[] $listings
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\ChannelAccount onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereAuthenticationInformation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereAuthenticationToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereChannelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ChannelAccount withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\ChannelAccount withoutTrashed()
 * @mixin \Eloquent
 * @property string|null $authentication_key
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelAccount whereAuthenticationKey($value)
 */
class ChannelAccount extends Model
{
	use SoftDeletes;
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'channel_id',
		'description',
		'authentication_token',
		'authentication_information',
	];

	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    // public function channel()
    // {
    //     return $this->belongsTo(Listing::class);
    // }
}
