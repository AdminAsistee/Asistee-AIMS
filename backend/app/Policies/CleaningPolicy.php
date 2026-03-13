<?php

namespace App\Policies;

use App\User;
use App\Cleaning;
use Illuminate\Auth\Access\HandlesAuthorization;

class CleaningPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the cleaning.
     *
     * @param  \App\User  $user
     * @param  \App\Cleaning  $cleaning
     * @return mixed
     */
    public function view(User $user, Cleaning $cleaning)
    {
        return $user->type == 'administrator' 
            || $user->type == 'supervisor'
            || ($user->type == 'cleaner' 
                && ($user->id == $cleaning->cleaner_id
                    || is_null($cleaning->cleaner_id))
                )
            || ($user->type == 'client'
                && $user->id == $cleaning->location->owner_id);
    }
 
    /**
     * Determine whether the user can create cleanings.
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
     * Determine whether the user can update the cleaning.
     *
     * @param  \App\User  $user
     * @param  \App\Cleaning  $cleaning
     * @return mixed
     */
    public function update(User $user, Cleaning $cleaning)
    {
        return $user->type == 'administrator' 
            || $user->type == 'supervisor'
            || ($user->type == 'client'
                && $user->id == $cleaning->location->owner_id)
            || ($user->type == 'cleaner'
                && ($user->id == $cleaning->cleaner_id
                    || is_null($cleaning->cleaner_id)));
    }

    /**
     * Determine whether the user can delete the cleaning.
     *
     * @param  \App\User  $user
     * @param  \App\Cleaning  $cleaning
     * @return mixed
     */
    public function delete(User $user, Cleaning $cleaning)
    {
        return $user->type == 'administrator';
    }
}
