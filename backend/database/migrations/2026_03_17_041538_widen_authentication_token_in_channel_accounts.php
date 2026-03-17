<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class WidenAuthenticationTokenInChannelAccounts extends Migration
{
    public function up()
    {
        Schema::table('channel_accounts', function (Blueprint $table) {
            $table->text('authentication_token')->nullable()->change();
            $table->text('authentication_information')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('channel_accounts', function (Blueprint $table) {
            $table->string('authentication_token', 255)->nullable()->change();
            $table->string('authentication_information', 255)->nullable()->change();
        });
    }
}
