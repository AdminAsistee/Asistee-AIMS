<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\SuppliesTransaction;
use App\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;
use Illuminate\Pagination\Paginator;
use App\Scopes\SuppliesTransactionFilter;

class SuppliesTransactionController extends Controller {

	protected $validationRulesForCreation = [
		'supply_id'   => 'required|integer|min:1|exists:supplies,id',
		'amount'      => 'sometimes|integer|min:1',
		'cleaning_id' => 'required|integer|min:1|exists:cleanings,id',
	];

	protected $validationRulesForUpdate = [
		'amount' => 'sometimes|integer|min:1',
		'status' => 'sometimes|string|in:not_fulfilled,staged,delivered',
	];

	protected $updateable = [
		'amount',
		'status',
		'administrator' => [
			'amount',
			'status',
			// 	'amount',
			// 	'status',
			// 	'remove_cleaner',
			// 	'cleaner_id',
			// 	'start_time',
			// 	'end_time',
		],
		'supervisor'    => [
			'amount',
			'status',
			// 	'amount',
			// 	'status',
			// 	'remove_cleaner',
			// 	'cleaner_id',
			// 	'start_time',
			// 	'end_time',
		],
		'client'        => [
			'amount',
			'status',
			// 	'amount',
			// 	'status',
			// 	'remove_cleaner',
		],
		'cleaner'       => [
			'amount',
			'status',
			// 	'amount','status'
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
		$createdSuppliesTransaction = SuppliesTransaction::create( $this->mutateForCreation( $request->all() ) );

		return $this->creationSuccessResponse( 'SuppliesTransaction', $createdSuppliesTransaction->id );
	}

	/**
	 * @param SuppliesTransactionFilter $filter
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function index( SuppliesTransactionFilter $filter ) {
		if ( Gate::allows( 'operations' ) ) {
			$supplies = SuppliesTransaction::filter( $filter )
			                               ->paginate( 30 );
		} else {
			return $this->AuthorizationFailureResponse( 'view', 'SuppliesTransaction' );
		}

		return response( $supplies, 200 );

	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function show( $id ) {
		$SuppliesTransaction = SuppliesTransaction::findOrFail( $id );

		// if ( Gate::allows( 'view_SuppliesTransaction', $SuppliesTransaction ) ) {
		return response( $SuppliesTransaction, 200 );
		// } else {
		// return $this->AuthorizationFailureResponse( 'view', 'SuppliesTransaction' );
		// }

	}


	/**
	 * @param SuppliesTransaction $SuppliesTransaction
	 * @param Request $request
	 *
	 * @return bool|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function update( SuppliesTransaction $supply_transaction, Request $request ) {
		// Authorize Update action
		// if ( Gate::denies( 'update_SuppliesTransaction', $supply_transaction ) ) {
		// 	return $this->AuthorizationFailureResponse( 'update', 'supply_transaction' );
		// }

		if ( count( $request->all() ) == 0 ) {
			return $this->updateFailureResponse( 'supply_transaction', 'At least 1 parameter to update must be given.' );
		}

		// Validate Default supply_transaction Parameters
		$valid_requests = $request->only( $this->updateable[ Auth::user()->type ] );

		if ( $this->validationFails( $valid_requests, $this->validationRulesForUpdate ) ) {
			return $this->validationResponse;
		}

		$supply_transaction->update( $this->mutateForUpdate( $valid_requests ) );

		return response( $supply_transaction, 202 );
	}

	/**
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForUpdate( $request ) {
		// if ( Gate::allows( 'cleaner' ) ) {}
		return $request;
	}

	public function fulfill( SuppliesTransaction $supply_transaction, Request $request ) {

		$supply_transaction->status               = "staged";
		$supply_transaction->supply->ready_stock  = $supply_transaction->supply->ready_stock - $supply_transaction->amount;
		$supply_transaction->supply->in_use_stock = $supply_transaction->supply->in_use_stock + $supply_transaction->amount;
		$supply_transaction->supply->save();
		$supply_transaction->save();

		return response( $supply_transaction, 202 );

	}

	public function deliver( SuppliesTransaction $supply_transaction, Request $request ) {

		$supply_transaction->status = "delivered";
		$supply_transaction->save();

		return response( $supply_transaction, 202 );

	}
}
