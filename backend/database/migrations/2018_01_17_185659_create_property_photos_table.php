<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePropertyPhotosTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create( 'property_photos', function ( Blueprint $table ) {
			$table->increments( 'id' );
			$table->text( 'full_path' );
			$table->text( 'thumb_path' );
			$table->string( 'type' )->index();
			$table->text( 'name' );
			$table->integer( 'location_id' )->unsigned()->index();
			$table->integer( 'user_id' )->unsigned()->index();
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
		Schema::dropIfExists( 'property_photos' );
	}
}
