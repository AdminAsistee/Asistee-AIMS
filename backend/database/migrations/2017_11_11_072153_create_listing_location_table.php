<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateListingLocationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('listing_location', function (Blueprint $table) {
            // Foreign Key Rleations
            $table->integer('listing_id')->unsigned();
            $table->foreign('listing_id')
					->references('id')->on('listings');
            $table->integer('location_id')->unsigned();
            $table->foreign('location_id')
					->references('id')->on('locations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('listing_location');
    }
}
