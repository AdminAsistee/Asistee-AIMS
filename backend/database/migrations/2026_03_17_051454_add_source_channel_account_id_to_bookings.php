<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSourceChannelAccountIdToBookings extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Tracks which channel account created this booking (null = manually created)
            $table->unsignedInteger('source_channel_account_id')->nullable()->after('listing_id');
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('source_channel_account_id');
        });
    }
}
