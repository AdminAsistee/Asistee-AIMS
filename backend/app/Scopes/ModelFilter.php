<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class ModelFilter {

	/** @var Request */
	protected $request;
	/** @var Builder */
	protected $query;
	/** @var  integer */
	public $itemsPerPage;

	/**
	 * ModelFilter constructor.
	 *
	 * @param Request $request
	 */
	public function __construct( Request $request ) {
		$this->request                  = $request;
		$this->request['custom_before'] = 1;
		$this->itemsPerPage             = 30;
	}

	public function get_request() {
		return $this->request;
	}

	/**
	 * @param Builder $query
	 *
	 * @return Builder
	 */
	public function apply( Builder $query ) {
		$this->query = $query;

		foreach ( $this->request->all() as $key => $val ) {
			if ( method_exists( $this, $key ) ) {
				if ( $val ) {
					call_user_func_array( [ $this, $key ], array_filter( [ $val ] ) );
				}
			}
		}

		return $this->query;
	}
}