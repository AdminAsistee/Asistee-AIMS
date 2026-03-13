<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Supply;
use App\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;
use Illuminate\Pagination\Paginator;
use App\Scopes\SupplyFilter;

class SupplyController extends Controller {

	protected $validationRulesForCreation = [
		'name'                 => 'required|string',
		'ready_stock'          => 'sometimes|integer|min:0',
		'in_use_stock'         => 'sometimes|integer|min:0',
		'in_maintenance_stock' => 'sometimes|integer|min:0',
	];

	protected $validationRulesForUpdate = [
		'ready_stock'          => 'sometimes|integer|min:0',
		// status
		'in_use_stock'         => 'sometimes|integer|min:0',
		'in_maintenance_stock' => 'sometimes|integer|min:0',
		// start_time: null,
		// end_time: null,
	];

	protected $updateable = [
		'ready_stock',
		'in_use_stock',
		'in_maintenance_stock',
		'administrator' => [
			'ready_stock',
			'in_use_stock',
			'in_maintenance_stock',
			// 	'Supply_date',
			// 	'status',
			// 	'remove_cleaner',
			// 	'cleaner_id',
			// 	'start_time',
			// 	'end_time',
		],
		'supervisor'    => [
			'ready_stock',
			'in_use_stock',
			'in_maintenance_stock',
			// 	'Supply_date',
			// 	'status',
			// 	'remove_cleaner',
			// 	'cleaner_id',
			// 	'start_time',
			// 	'end_time',
		],
		'client'        => [
			'ready_stock',
			'in_use_stock',
			'in_maintenance_stock',
			// 	'Supply_date',
			// 	'status',
			// 	'remove_cleaner',
		],
		'cleaner'       => [
			'ready_stock',
			'in_use_stock',
			'in_maintenance_stock',
			// 	'cleaner_id',
		],
	];

	/**
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	/*Good*/
	public function store( Request $request ) {
		if ( $this->validationFails( $request->all(), $this->validationRulesForCreation ) ) {
			return $this->validationResponse;
		}
		if ( Gate::allows( 'admin' ) or Gate::allows( 'supervisor' ) ) {
			$createdSupply = Supply::create( $this->mutateForCreation( $request->all() ) );
		} else {
			return $this->AuthorizationFailureResponse( 'store', 'Supply' );
		}

		return $this->creationSuccessResponse( 'Supply', $createdSupply->id );
	}

	/**
	 * @param SupplyFilter $filter
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function index( SupplyFilter $filter ) {
		if ( Gate::allows( 'operations' ) ) {
			$supplies = Supply::filter( $filter )->orderBy( 'id', 'desc' )
			                  ->paginate(300);
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'Supply' );
		}

		return response( $supplies, 200 );

	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function show( $id ) {
		$Supply = Supply::findOrFail( $id );

		// if ( Gate::allows( 'view_supply', $Supply ) ) {
		return response( $Supply, 200 );
		// } else {
		// 	return $this->AuthorizationFailureResponse( 'view', 'Supply' );
		// }

	}


	/**
	 * @param Supply $Supply
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function update( Supply $Supply, Request $request ) {
		// Authorize Update action
		// if ( Gate::denies( 'update_supply', $Supply ) ) {
		// 	return $this->AuthorizationFailureResponse( 'update', 'Supply' );
		// }

		if ( count( $request->all() ) == 0 ) {
			return $this->updateFailureResponse( 'Supply', 'At least 1 parameter to update must be given.' );
		}

		// Validate Default Supply Parameters
		$valid_requests = $request->only( $this->updateable[ Auth::user()->type ] );

		if ( $this->validationFails( $valid_requests, $this->validationRulesForUpdate ) ) {
			return $this->validationResponse;
		}

		$Supply->update( $this->mutateForUpdate( $valid_requests ) );

		return response( $Supply, 202 );
	}

	public function buy( Supply $Supply, Request $request ) {
		if ( Gate::allows( 'admin' ) or Gate::allows( 'supervisor' ) ) {
			$amount              = $request['amount'];
			$current_ready_stock = $Supply->ready_stock;
			$Supply->ready_stock = $current_ready_stock + $amount;
			$Supply->save();

			return response( $Supply, 202 );
		} else {
			return $this->AuthorizationFailureResponse( 'buy', 'Supply' );
		}
	}

	public function use( Supply $Supply, Request $request ) {
		if ( Gate::allows( 'admin' ) or Gate::allows( 'supervisor' ) ) {
			$amount               = $request['amount'];
			$current_ready_stock  = $Supply->ready_stock;
			$current_in_use_stock = $Supply->in_use_stock;
			$Supply->ready_stock  = $current_ready_stock - $amount;
			$Supply->in_use_stock = $current_in_use_stock + $amount;
			$Supply->save();

			return response( $Supply, 202 );
		} else {
			return $this->AuthorizationFailureResponse( 'use', 'Supply' );
		}
	}

	/**
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForUpdate(array $request = []): array {
		if ( Gate::allows( 'cleaner' ) ) {
		}

		return $request;
	}
}
