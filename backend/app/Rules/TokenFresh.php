<?php

namespace App\Rules;

use App\PasswordResets;
use Illuminate\Contracts\Validation\Rule;

class TokenFresh implements Rule {
	/**
	 * Determine if the validation rule passes.
	 *
	 * @param  string $attribute
	 * @param  mixed $token
	 *
	 * @return bool
	 */
	public function passes( $attribute, $token ) {
		if ( PasswordResets::expired( $token ) ) {
			PasswordResets::deleteEntry( $token );

			return false;
		}

		return true;
	}

	/**
	 * Get the validation error message.
	 *
	 * @return string
	 */
	public function message() {
		return 'This token has expired. Please try resetting again!';
	}
}
