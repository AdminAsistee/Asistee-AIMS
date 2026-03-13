<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name'     => fake()->name(),
            'email'    => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'type'     => 'client',
        ];
    }

    public function admin(): static
    {
        return $this->state(['type' => 'administrator']);
    }

    public function cleaner(): static
    {
        return $this->state(['type' => 'cleaner']);
    }

    public function supervisor(): static
    {
        return $this->state(['type' => 'supervisor']);
    }
}
