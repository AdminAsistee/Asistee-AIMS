<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create( 'users', function ( Blueprint $table ) {
			$table->increments( 'id' );
			$table->string( 'name' )->index();
			$table->string( 'email' )->unique()->index();
			$table->string( 'bio' )->nullable();
			$table->string( 'phone' )->nullable();
			$table->string( 'address' )->nullable();
			$table->string( 'stripe_customer_id' , 255)->nullable();
			$table->string( 'password' );
			// $table->enum( 'type', \App\User::$types )->index();
			$table->string( 'type' )->default('client');
			$table->rememberToken();
			$table->softDeletes();
			$table->timestamps();
		} );
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists( 'users' );
	}
}
