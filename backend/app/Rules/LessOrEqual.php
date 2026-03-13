<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class LessOrEqual implements Rule {

	protected $compareWithValue;
	protected $compareWithKey;
	protected $attributeName;

	/**
	 * LessOrEqual constructor.
	 *
	 * @param $compareWithValue
	 * @param $compareWithName
	 */
	public function __construct( $compareWithValue, $compareWithName ) {
		$this->compareWithValue = $compareWithValue;
		$this->compareWithKey   = $compareWithName;
	}

	/**
	 * Determine if the validation rule passes.
	 *
	 * @param  string $attribute
	 * @param  mixed $value
	 *
	 * @return bool
	 */
	public function passes( $attribute, $value ) {
		$this->attributeName = $attribute;

		return $value <= $this->compareWithValue;
	}

	/**
	 * Get the validation error message.
	 *
	 * @return string
	 */
	public function message() {
		return ucfirst( $this->attributeName ) . ' should be less than or equal to ' . ucfirst( $this->compareWithKey );
	}
}
