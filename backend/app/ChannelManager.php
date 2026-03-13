<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\ChannelManager
 *
 * @property int $id
 * @property int $owner_id
 * @property string $description
 * @property string|null $deleted_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Query\Builder|\App\ChannelManager onlyTrashed()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelManager whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelManager whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelManager whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelManager whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelManager whereOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ChannelManager whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ChannelManager withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\ChannelManager withoutTrashed()
 * @mixin \Eloquent
 */
class ChannelManager extends Model
{
	use SoftDeletes;
}
