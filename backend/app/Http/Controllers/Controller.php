<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Validator;

class Controller extends BaseController {
	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
	protected $validationResponse = false;

	protected function AuthorizationFailureResponse( $action, $resource ) {
		return response( [ 'message' => 'You are not authorized to ' . $action . ' a ' . $resource . '.'  ], 401 );
	}

	/**
	 * @param string $objectName
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	protected function creationSuccessResponse( $objectName, $id ) {
		return response( [
			'message' => $objectName . ' Created!',
			'id'      => $id,
		], 201 );
	}

	/**
	 * @param $objectName
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	protected function creationFailureResponse( $objectName, $message ) {
		return response( [ 'message' => $objectName . ' Not Created. ' . $message ], 422 );
	}

	/**
	 * @param $objectName
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	protected function updateSuccessResponse( $objectName ) {
		return response( [
			'message' => $objectName . ' Updated!'
		], 202 );
	}

	/**
	 * @param $objectName
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	protected function updateFailureResponse( $objectName , $message ) {
		return response( ['message' => $objectName . ' Not Updated. ' . $message], 422 );
	}

	/**
	 * @param $objectName
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	protected function deleteSuccessResponse( $objectName ) {
		return response( [
			'message' => $objectName . ' Deleted!'
		], 202 );
	}

	/**
	 * @param $objectName1
	 * @param $objectName2
	 * @param $success
	 * @param $message
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	protected function associationResponse( $objectName1, $objectName2, $success, $message ) {
		return response( [
			'message' => $message,
			'objects' => $objectName1 . ' and ' . $objectName2 . ' association ' . ( $success ? 'Success' : 'Failed' )
		], ( $success ? 200 : 400 ) );
	}

	/**
	 * @param $objectName
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	protected function locateFailureResponse( $objectName ) {
		return response( [ 'message' => $objectName . ' Not Found.' ], 400 );
	}

	/**
	 * @param $fields
	 * @param $rules
	 *
	 * @return bool
	 */
	protected function validationFails( $fields, $rules ) {
		$validator = Validator::make( $fields, $rules );

		if ( $validator->fails() ) {
			$this->validationResponse = response( [
				'error' => [
					'message'    => "Can't process request. Invalid data",
					'error_list' => $validator->errors()->toArray()
				]
			], 422 );

			return true;
		}

		return false;

	}

	/**
	 * Mutate necessary fields before creation
	 *
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForCreation( $request ) {

		return $request;
	}


	/**
	 * Mutate necessary fields before update
	 *
	 * @param array $request
	 *
	 * @return array
	 */
	protected function mutateForUpdate( $request ) {

		return $request;
	}
}
