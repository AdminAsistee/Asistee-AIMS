<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\OAuthClients
 *
 * @property int $id
 * @property int|null $user_id
 * @property string $name
 * @property string $secret
 * @property string $redirect
 * @property int $personal_access_client
 * @property int $password_client
 * @property int $revoked
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients wherePasswordClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients wherePersonalAccessClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereRedirect($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereRevoked($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\OAuthClients whereUserId($value)
 * @mixin \Eloquent
 */
class OAuthClients extends Model {
	protected $table = 'oauth_clients';
	protected function serializeDate(\DateTimeInterface $date)
	{
		return $date->format('c');
	}
}
