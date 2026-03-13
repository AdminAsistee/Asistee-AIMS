<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

// NEEDS : Users
// : notes
// : prices
// : feedbacks

// + 3 hours

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('listing_id')->unsigned();
            $table->foreign('listing_id')->references('id')
                ->on('listings');

            $table->date('checkin');
            $table->date('checkout');
            $table->string('confirmation_code')->nullable();
            $table->time('planned_checkin_time')->nullable();
            $table->time('planned_checkout_time')->nullable();
            $table->integer('guest_id')->unsigned()->nullable();
            $table->foreign('guest_id')
                    ->references('id')->on('users');
            $table->integer('guests')->unsigned();
            $table->integer('beds')->unsigned();
            // $table->enum('status', \App\Booking::$field_status)->default('newly_created'); // Tricky
            $table->string( 'status' )->default('active');
            $table->integer('note_id')->unsigned()->nullable();
            $table->foreign('note_id')->references('id')
                ->on('notes');
            $table->integer('price_id')->unsigned()->nullable();
            $table->foreign('price_id')->references('id')
                ->on('prices');
            $table->integer('guest_cleaning_feedback_id')->unsigned()->nullable();
            $table->integer('guest_stay_feedback_id')->unsigned()->nullable();
            $table->integer('cleaner_feedback_id')->unsigned()->nullable();
            $table->foreign('guest_cleaning_feedback_id')->references('id')
                ->on('feedback');
            $table->foreign('guest_stay_feedback_id')->references('id')
                ->on('feedback');
            $table->foreign('cleaner_feedback_id')->references('id')
                ->on('feedback');
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
        Schema::dropIfExists('bookings');
    }
}
