<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // MySQL index key length fix for older MySQL versions
        Schema::defaultStringLength(191);

        // ─── Authorization Gates (role-based) ────────────────────────────────
        // Checks user->type field which is set at registration / by admin

        Gate::define('admin', fn(User $user) => $user->type === 'administrator');

        Gate::define('supervisor', fn(User $user) => in_array($user->type, [
            'administrator', 'supervisor',
        ]));

        Gate::define('admin-supervisor', fn(User $user) => in_array($user->type, [
            'administrator', 'supervisor',
        ]));

        Gate::define('management', fn(User $user) => in_array($user->type, [
            'administrator', 'supervisor', 'manager',
        ]));

        Gate::define('cleaner', fn(User $user) => in_array($user->type, [
            'administrator', 'cleaner',
        ]));
    }

    public function register(): void
    {
        //
    }
}
