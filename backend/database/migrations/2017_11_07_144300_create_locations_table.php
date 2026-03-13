<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

// NEEDS : Users

class CreateLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('building_name');
            $table->integer('room_number')->unsigned()->default(0);
            $table->string('address');
            $table->double('latitude',9,7)->nullable();
            $table->double('longitude',10,7)->nullable();
            $table->string('map_link');
            $table->string('guest_photo_directions_link')->nullable();
            $table->integer('max_beds')->unsigned()->nullable();
            $table->string('entry_info', 255);
            $table->string('mail_rules')->nullable();
            $table->string('trash_rules', 255)->nullable();

            // $table->enum('status', ['active', 'suspended', 'discontinued'])->default('active');
            $table->string( 'status' )->default('active');
            // Foreign Key Rleations
            $table->integer('owner_id')->unsigned(); // << NOTE : Foreign Key integer index must be unsigned.
            $table->foreign('owner_id')
                    ->references('id')->on('users');
            $table->integer('channel_manager_id')->unsigned()->nullable();
            $table->integer('default_cleaner')->unsigned()->nullable(); // << NOTE : Foreign Key integer index must be unsigned.
            $table->foreign('default_cleaner')
                    ->references('id')->on('users');
            // NOTES are a pivot table
            // All pricing will eventuallly be moved into date-specific tables that have a date-value. For any given date, the value to be used is the previously most recent date's value. ie: 2017-12-01 [LID] 4500 >> 2018-02-01 [LID] 5300 << 2017-12-25 value would use 4500 but 2018-02-15 would use 5300.
            $table->double('default_staff_cleaning_payout')->default(2500);
            $table->double('default_client_charge')->default(13000);
            $table->double('per_bed_charge')->unsigned()->default(1000);
            $table->double('per_guest_charge')->unsigned()->default(1500);
            $table->double('SplitRate',4,4)->nullable();
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('locations');
    }
}
