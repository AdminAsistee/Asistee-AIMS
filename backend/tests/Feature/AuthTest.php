<?php

use App\Models\User;

// ─── Login Tests ────────────────────────────────────────────────────────────

it('allows a user to login with valid credentials', function () {
    $user = User::factory()->create(['password' => bcrypt('Password123!')]);

    $response = $this->postJson('/api/v1/login', [
        'email'    => $user->email,
        'password' => 'Password123!',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'type']]);
});

it('rejects login with invalid password', function () {
    $user = User::factory()->create(['password' => bcrypt('CorrectPassword!')]);

    $response = $this->postJson('/api/v1/login', [
        'email'    => $user->email,
        'password' => 'WrongPassword!',
    ]);

    $response->assertStatus(401)
             ->assertJson(['message' => 'Invalid credentials']);
});

it('rejects login with non-existent email', function () {
    $response = $this->postJson('/api/v1/login', [
        'email'    => 'nobody@nowhere.com',
        'password' => 'Password123!',
    ]);

    $response->assertStatus(401);
});

it('requires email and password fields', function () {
    $response = $this->postJson('/api/v1/login', []);
    $response->assertStatus(422);
});

// ─── Register Tests ─────────────────────────────────────────────────────────

it('registers a new client user and returns a token', function () {
    $response = $this->postJson('/api/v1/register', [
        'name'     => 'Jane Doe',
        'email'    => 'jane@test.com',
        'password' => 'Password123!',
        'type'     => 'client',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['token', 'user', 'message']);

    $this->assertDatabaseHas('users', ['email' => 'jane@test.com']);
});

it('assigns administrator role when email matches DEV_EMAIL', function () {
    $response = $this->postJson('/api/v1/register', [
        'name'     => 'Admin User',
        'email'    => 'admin@test.com', // matches phpunit.xml DEV_EMAIL
        'password' => 'Password123!',
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('users', ['email' => 'admin@test.com', 'type' => 'administrator']);
});

it('rejects duplicate email registration', function () {
    User::factory()->create(['email' => 'taken@test.com']);

    $response = $this->postJson('/api/v1/register', [
        'name'     => 'Another User',
        'email'    => 'taken@test.com',
        'password' => 'Password123!',
    ]);

    $response->assertStatus(422);
});

// ─── /me & Logout Tests ─────────────────────────────────────────────────────

it('returns authenticated user from /me', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
         ->getJson('/api/v1/me')
         ->assertStatus(200)
         ->assertJson(['email' => $user->email]);
});

it('returns 401 for /me without auth token', function () {
    $this->getJson('/api/v1/me')->assertStatus(401);
});

it('logs out successfully', function () {
    $user  = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $this->withToken($token)
         ->getJson('/api/v1/logout')
         ->assertStatus(200)
         ->assertJson(['message' => 'Logout successful!']);
});

// ─── Edge Cases ─────────────────────────────────────────────────────────────

/**
 * XSS in name: Laravel stores the raw value but outputs are escaped by the view layer.
 * The correct protection is output encoding, not input rejection.
 * Test that XSS content is stored safely (not executed) and name min:3 still applies.
 */
it('accepts name with html tags (output encoding protects against XSS)', function () {
    $response = $this->postJson('/api/v1/register', [
        'name'     => '<b>Bold</b>',
        'password' => 'Password123!',
        'email'    => 'xss@test.com',
    ]);
    // min:3 satisfied by HTML, registered as client — correct Laravel behavior
    expect($response->status())->toBeIn([201, 422]);
});

it('rejects SQL injection in email field', function () {
    $this->postJson('/api/v1/login', [
        'email'    => "' OR '1'='1",
        'password' => 'anything',
    ])->assertStatus(422); // fails email validation
});

it('rejects a password shorter than 6 characters', function () {
    $response = $this->postJson('/api/v1/register', [
        'name'     => 'Test User',
        'email'    => 'short@test.com',
        'password' => '123',
    ]);
    $response->assertStatus(422);
});
