<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChannelAccount;
use App\Listing;

class ChannelAccountController extends Controller
{
    /**
     * List all channel accounts with their listing counts.
     */
    public function index()
    {
        $accounts = ChannelAccount::all()->map(function ($account) {
            $account->listings_count = $account->listings()->count();
            return $account;
        });
        return response()->json($accounts, 200);
    }

    /**
     * Create a new channel account.
     * channel_id: 1 = Airbnb, 2 = iCal, 0 = Manual
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'description'            => 'required|string|max:255',
            'channel_id'             => 'required|integer|in:0,1,2',
            'authentication_token'   => 'nullable|string',
            'authentication_information' => 'nullable|string',
        ]);

        // Encrypt token if provided
        if (!empty($data['authentication_token'])) {
            $data['authentication_token'] = encrypt($data['authentication_token']);
        }

        $account = ChannelAccount::create($data);
        $account->listings_count = 0;
        return response()->json($account, 201);
    }

    /**
     * Show a single channel account with its listings.
     */
    public function show(ChannelAccount $channelAccount)
    {
        return response()->json(
            $channelAccount->load('listings'),
            200
        );
    }

    /**
     * Update a channel account's description or token.
     */
    public function update(Request $request, ChannelAccount $channelAccount)
    {
        $data = $request->validate([
            'description'            => 'sometimes|string|max:255',
            'channel_id'             => 'sometimes|integer|in:0,1,2',
            'authentication_token'   => 'nullable|string',
            'authentication_information' => 'nullable|string',
        ]);

        if (array_key_exists('authentication_token', $data) && !empty($data['authentication_token'])) {
            $data['authentication_token'] = encrypt($data['authentication_token']);
        }

        $channelAccount->update($data);
        $channelAccount->listings_count = $channelAccount->listings()->count();
        return response()->json($channelAccount, 200);
    }

    /**
     * Soft-delete a channel account.
     */
    public function destroy(ChannelAccount $channelAccount)
    {
        // Guard: do not delete if it has active listings
        if ($channelAccount->listings()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete a channel account that has active listings. Remove or re-assign listings first.'
            ], 422);
        }

        $channelAccount->delete();
        return response()->json(['message' => 'Channel account deleted.'], 200);
    }
}
