<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

// + 1 hour

class CreateCleaningsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
    	Schema::disableForeignKeyConstraints();
        Schema::create('cleanings', function (Blueprint $table) {
            $table->increments('id');
            // NOTE: Cleanings cannot be assigned to Bookings or listings
            // because listing-location has a n-m realationship. If a booking
            // is is for a listing, or cleaning associated with a listing 
            // with multiple locations, 1 cleaning will not suffice.
            // (... Unless you do some complex things with pricing and cleaners)
            $table->integer('location_id')->unsigned();
            $table->date('cleaning_date')->nullable();

            $table->integer('cleaner_id')->unsigned()->nullable();
            // $table->enum('status', ['active', 'suspended', 'cancelled', 'in_progress','completed','reviewed','rejected'])->default('active'); 
            $table->string( 'status' )->default('active');
            $table->integer('staff_payout_price_id')->unsigned()->nullable();
            $table->foreign('staff_payout_price_id')
                    ->references('id')->on('prices');
            $table->integer('client_charge_price_id')->unsigned()->nullable();
            $table->foreign('client_charge_price_id')
                    ->references('id')->on('prices');

            $table->integer('note_id')->unsigned()->nullable();
            $table->foreign('note_id')
                    ->references('id')->on('notes');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cleanings');
    }
}
