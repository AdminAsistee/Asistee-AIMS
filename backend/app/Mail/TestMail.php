<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class TestMail extends Mailable {
	use Queueable, SerializesModels;
	public $data;

	/**
	 * TestMail constructor.
	 *
	 * @param $data
	 */
	public function __construct( $data ) {
		$this->data = $data;
	}

	/**
	 * Build the message.
	 *
	 * @return $this
	 */
	//->cc( 'AsisteeBusiness@Asistee.com' )
	public function build() {
		return $this->to( 'Tyler@Asistee.com' )
		            ->subject( 'Test AIMS Mail' )
		            ->view( 'test-email-html' );
	}
}
