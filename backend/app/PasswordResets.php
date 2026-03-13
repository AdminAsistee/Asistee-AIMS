<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\PasswordResets
 *
 * @property string $email
 * @property string $token
 * @property \Carbon\Carbon|null $created_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PasswordResets whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PasswordResets whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\PasswordResets whereToken($value)
 * @mixin \Eloquent
 */
class PasswordResets extends Model {
	protected $table = 'password_resets';
	protected $fillable = [
		'email',
		'token'
	];

	/**
	 * @param $token
	 *
	 * @return Model|null|static
	 */
	public static function getEntry( $token ) {
		return static::whereToken( $token )->first();
	}

	/**
	 * @param $email
	 *
	 * @return bool|mixed|null
	 */
	public static function deleteEntry( $email ) {
		return static::whereEmail( $email )->delete();
	}

	/**
	 * @param $token
	 *
	 * @return bool
	 */
	public static function expired( $token ) {
		if ( ! static::whereToken( $token )->count() ) {
			return false;
		}

		return static::whereToken( $token )->first()->created_at->addHour( 1 )->isPast();
	}

	public function setUpdatedAt( $value ) {
	}

	public function getUpdatedAtColumn() {
	}
}
