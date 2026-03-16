<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CleaningController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PropertyPhotoController;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\SuppliesTransactionController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\FeedbackController;

/*
|--------------------------------------------------------------------------
| API Routes — AIMS v2 (Laravel 12 + Sanctum)
|--------------------------------------------------------------------------
*/

// ─── Public Routes (no auth) ─────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    Route::post('/login',           [UserController::class, 'login']);
    Route::post('/register',        [UserController::class, 'register']);
    Route::post('/request-password-reset', [UserController::class, 'requestPasswordReset']);
    Route::post('/reset-password',  [UserController::class, 'performPasswordReset']);

    // ─── Protected Routes (Sanctum token required) ────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // — Auth / Profile
        Route::get('/me',            [UserController::class, 'me']);
        Route::get('/logout',        [UserController::class, 'logout']);
        Route::post('/save-card',    [UserController::class, 'saveCard']);

        // — Users (admin only)
        Route::middleware('can:admin')->group(function () {
            Route::get('/users',                    [UserController::class, 'index']);
            Route::get('/users/{user}',             [UserController::class, 'show']);
            Route::put('/users/{user}',             [UserController::class, 'update']);
            Route::delete('/users/{user}',          [UserController::class, 'delete']);
            Route::post('/users/admin-create',      [UserController::class, 'adminCreate']);
        });

        // — Bookings (management only)
        Route::get('/bookings',              [BookingController::class, 'index']);
        Route::post('/bookings',             [BookingController::class, 'store']);
        Route::get('/bookings/{booking}',    [BookingController::class, 'show']);
        Route::put('/bookings/{booking}',    [BookingController::class, 'update']);
        Route::delete('/bookings/{booking}', [BookingController::class, 'delete']);

        // — Cleanings
        Route::get('/cleanings',             [CleaningController::class, 'index']);
        Route::get('/cleanings/{cleaning}',  [CleaningController::class, 'show']);
        Route::post('/cleanings/create',     [CleaningController::class, 'store']);
        Route::put('/cleanings/{cleaning}',  [CleaningController::class, 'update']);

        // Cleaner-specific
        Route::put('/assign-me',             [CleaningController::class, 'assignMe']);

        // Admin/supervisor only
        Route::put('/unassign-cleaner',      [CleaningController::class, 'unassignCleaner']);
        Route::put('/assign-cleaner',        [CleaningController::class, 'assignCleaner']);
        Route::get('/cleaner-users',         [CleaningController::class, 'cleanerUsers']);

        // — Listings
        Route::get('/listings',              [ListingController::class, 'index']);
        Route::get('/listings/{listing}',    [ListingController::class, 'show']);
        Route::post('/listings/create',      [ListingController::class, 'register']);
        Route::post('/listings/addLocation', [ListingController::class, 'addLocation']);

        // — Locations
        Route::get('/locations/open',        [LocationController::class, 'getOpenProperties']);
        Route::get('/locations',             [LocationController::class, 'index']);
        Route::get('/locations/{location}',  [LocationController::class, 'show']);
        Route::get('/locations/{location}/bookings', [LocationController::class, 'viewBookings']);
        Route::get('/locations/{location}/listings', [LocationController::class, 'viewListings']);
        Route::post('/locations/create',     [LocationController::class, 'create']);
        Route::post('/locations/addListing', [LocationController::class, 'addListing']);
        Route::post('/locations-photo/{location}', [LocationController::class, 'uploadPhoto']);
        Route::delete('/locations/{location}',     [LocationController::class, 'delete']);
        Route::delete('/locations-photo/{photo}',  [PropertyPhotoController::class, 'delete']);


        // — Supplies
        Route::post('/supplies',             [SupplyController::class, 'store']);
        Route::put('/supplies/{supply}',     [SupplyController::class, 'update']);
        Route::get('/supplies',              [SupplyController::class, 'index']);
        Route::get('/supplies/{supply}',     [SupplyController::class, 'show']);
        Route::put('/supplies/{supply}/buy', [SupplyController::class, 'buy']);
        Route::put('/supplies/{supply}/use', [SupplyController::class, 'use']);

        // — Supply Transactions
        Route::post('/supplies_transactions',  [SuppliesTransactionController::class, 'store']);
        Route::put('/supplies_transactions/{supply_transaction}', [SuppliesTransactionController::class, 'update']);
        Route::get('/supplies_transactions',   [SuppliesTransactionController::class, 'index']);
        Route::get('/supplies_transactions/{supply_transaction}', [SuppliesTransactionController::class, 'show']);
        Route::put('/supplies_transactions/{supply_transaction}/fulfill', [SuppliesTransactionController::class, 'fulfill']);
        Route::put('/supplies_transactions/{supply_transaction}/deliver', [SuppliesTransactionController::class, 'deliver']);

        // — Prices (admin only)
        Route::post('/prices/create',        [PriceController::class, 'create']);
        Route::get('/prices/{price}',        [PriceController::class, 'show']);

        // — Channel (admin only)
        Route::get('/channel/cleanings',     [ChannelController::class, 'pullCleanings']);
        Route::get('/channel/{listing}',     [ChannelController::class, 'index']);

        // — Notes & Feedback
        Route::apiResource('/notes',         NoteController::class);
        Route::apiResource('/feedback',      FeedbackController::class);
    });
});
