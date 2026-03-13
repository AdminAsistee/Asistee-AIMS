<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChannelAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //NOTE : Not a pivot table.
        Schema::create('channel_accounts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description',255);
            $table->integer('channel_id');
            $table->string('authentication_token',255)->nullable();
            $table->string('authentication_key',255)->nullable();
            $table->json('authentication_information')->nullable();
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
        Schema::dropIfExists('channel_accounts');
    }
}
