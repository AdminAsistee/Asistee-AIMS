<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // MySQL index key length fix for older MySQL versions
        Schema::defaultStringLength(191);
    }

    public function register(): void
    {
        //
    }
}
