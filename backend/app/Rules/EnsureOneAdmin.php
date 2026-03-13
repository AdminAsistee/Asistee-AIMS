<?php

namespace App\Rules;

use App\User;
use Illuminate\Contracts\Validation\Rule;

class EnsureOneAdmin implements Rule {


	/**
	 * Determine if the validation rule passes.
	 *
	 * @param  string $attribute
	 * @param  mixed $value
	 *
	 * @return bool
	 */
	public function passes( $attribute, $value ) {
		if ( \Auth::id() == \Route::current()->parameter( 'user' )->id and User::whereType( 'administrator' )->count() === 1 ) {
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
		return "Can't change type of the last administrator";
	}
}
