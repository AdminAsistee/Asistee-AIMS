<?php

namespace App\Policies;

use App\User;
use App\Listing;
use Illuminate\Auth\Access\HandlesAuthorization;

class ListingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the listing.
     *
     * @param  \App\User  $user
     * @param  \App\Listing  $listing
     * @return mixed
     */
    public function view(User $user, Listing $listing)
    {
        return true;
    }

    /**
     * Determine whether the user can create listings.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the listing.
     *
     * @param  \App\User  $user
     * @param  \App\Listing  $listing
     * @return mixed
     */
    public function update(User $user, Listing $listing)
    {
        return true;
    }

    /**
     * Determine whether the user can delete the listing.
     *
     * @param  \App\User  $user
     * @param  \App\Listing  $listing
     * @return mixed
     */
    public function delete(User $user, Listing $listing)
    {
        return true;
    }
}
