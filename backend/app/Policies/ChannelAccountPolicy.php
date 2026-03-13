<?php

namespace App\Policies;

use App\User;
use App\ChannelAccount;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChannelAccountPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the channelAccount.
     *
     * @param  \App\User  $user
     * @param  \App\ChannelAccount  $channelAccount
     * @return mixed
     */
    public function view(User $user, ChannelAccount $channelAccount)
    {
        //
    }

    /**
     * Determine whether the user can create channelAccounts.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the channelAccount.
     *
     * @param  \App\User  $user
     * @param  \App\ChannelAccount  $channelAccount
     * @return mixed
     */
    public function update(User $user, ChannelAccount $channelAccount)
    {
        //
    }

    /**
     * Determine whether the user can delete the channelAccount.
     *
     * @param  \App\User  $user
     * @param  \App\ChannelAccount  $channelAccount
     * @return mixed
     */
    public function delete(User $user, ChannelAccount $channelAccount)
    {
        //
    }
}
