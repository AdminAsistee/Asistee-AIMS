<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSuppliesTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplies_transactions', function (Blueprint $table) {
            $table->increments( 'id' );
            $table->integer( 'amount' );
            $table->string( 'status' )->default('not_fulfilled');
            $table->integer( 'supply_id' )->unsigned()->index();
            $table->integer( 'cleaning_id' )->unsigned()->index();// Requested Cleaning
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
        Schema::dropIfExists('supplies_transactions');
    }
}