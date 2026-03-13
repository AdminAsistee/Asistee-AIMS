<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler {
	/**
	 * A list of the exception types that are not reported.
	 *
	 * @var array
	 */
	protected $dontReport = [
		//
	];

	/**
	 * A list of the inputs that are never flashed for validation exceptions.
	 *
	 * @var array
	 */
	protected $dontFlash = [
		'password',
		'password_confirmation',
	];

	/**
	 * Report or log an exception.
	 *
	 * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
	 *
	 * @param  \Exception $exception
	 *
	 * @return void
	 */
	public function report( Exception $exception ) {
		parent::report( $exception );
	}

	/**
	 * Render an exception into an HTTP response.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  \Exception $exception
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function render( $request, Exception $exception ) {
		if ( $exception instanceof MethodNotAllowedHttpException ) {
			return response( [
				'message'     => 'This method is not allowed for this endpoint.',
				'description' => 'Make sure you\'re not sending a GET request to a POST type endpoint or something like that'
			], 500 );
		}

		if ( $exception instanceof NotFoundHttpException ) {
			return response( [
				'message' => 'This path is not defined',
			], 404 );
		}

		if ( $exception instanceof AuthenticationException ) {
			return response( [
				'message'   => 'Unauthenticated or wrong method (e.g. GET on a POST path)',
				'auth_docs' => \URL::to( '/docs/oauth' ),
			], 401 );
		}

		if ( $exception instanceof ModelNotFoundException ) {
			return response( [
				'message' => 'Object not found',
			], 422 );
		}

		return response( [
			'error' => [
				'message'        => $exception->getMessage(),
				'code'           => $exception->getCode(),
				'exception_type' => get_class( $exception ),
			]
		], 500 );

//		return parent::render( $request, $exception );
	}
}
