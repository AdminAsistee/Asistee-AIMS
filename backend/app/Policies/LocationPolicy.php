<?php

namespace App\Policies;

use App\User;
use App\Location;
use Illuminate\Auth\Access\HandlesAuthorization;

class LocationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the location.
     *
     * @param  \App\User  $user
     * @param  \App\Location  $location
     * @return mixed
     */
    public function view(User $user, Location $location)
    {
        return $user->type == 'administrator' 
            || $user->type == 'supervisor'
            || $user->type == 'cleaner'
            || ($user->type == 'client'
                && $user->id == $location->owner_id);
    }

    /**
     * Determine whether the user can create locations.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->type == 'administrator' 
            || $user->type == 'supervisor'
            || $user->type == 'client';
    }

    /**
     * Determine whether the user can update the location.
     *
     * @param  \App\User  $user
     * @param  \App\Location  $location
     * @return mixed
     */
    public function update(User $user, Location $location)
    {
        return $user->type == 'administrator' 
            || $user->type == 'supervisor'
            || ($user->type == 'client'
                && $user->id == $location->owner_id);
    }

    /**
     * Determine whether the user can delete the location.
     *
     * @param  \App\User  $user
     * @param  \App\Location  $location
     * @return mixed
     */
    public function delete(User $user, Location $location)
    {
        return $user->type == 'administrator';
    }
}
