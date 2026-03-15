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

        // Gates used by Gen 3 module controllers
        Gate::define('operations', fn(User $user) => in_array($user->type, [
            'administrator', 'supervisor', 'client',
        ]));

        Gate::define('kankeisha', fn(User $user) => in_array($user->type, [
            'administrator', 'supervisor',
        ]));

        Gate::define('client', fn(User $user) => in_array($user->type, [
            'administrator', 'supervisor', 'client',
        ]));

        // Policies for view/update checks
        Gate::define('view_Cleaning', fn(User $user, $cleaning) => in_array($user->type, [
            'administrator', 'supervisor', 'client',
        ]) || $cleaning->cleaner_id === $user->id);

        Gate::define('update_Cleaning', fn(User $user, $cleaning) => in_array($user->type, [
            'administrator', 'supervisor', 'client', 'cleaner',
        ]));

        Gate::define('view_Location', fn(User $user, $location) => in_array($user->type, [
            'administrator', 'supervisor',
        ]) || $location->owner_id === $user->id);

        Gate::define('update_Location', fn(User $user, $location) => in_array($user->type, [
            'administrator', 'supervisor',
        ]) || $location->owner_id === $user->id);

        Gate::define('create_Location', fn(User $user) => in_array($user->type, [
            'administrator', 'supervisor', 'client',
        ]));
    }

    public function register(): void
    {
        //
    }
}
