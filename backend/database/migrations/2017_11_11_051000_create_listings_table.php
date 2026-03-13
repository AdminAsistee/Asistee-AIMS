<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

// NEEDS : Channel_accounts

class CreateListingsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::disableForeignKeyConstraints();
		Schema::create( 'listings', function ( Blueprint $table ) {
			$table->increments( 'id' );
			$table->integer( 'channel_account_id' )->unsigned();
			$table->foreign( 'channel_account_id' )
			      ->references( 'id' )->on( 'channel_accounts' );
			$table->string( 'channel_listing_id' ); // this could be confusing - The Channel's identifier for the listing itself.
			// $table->enum( 'status', \App\Listing::$field_status )->default( 'active' );
			$table->string( 'status' )->default('active');
			$table->string( 'listing_title' )->nullable();
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
		Schema::dropIfExists( 'listings' );
	}
}
