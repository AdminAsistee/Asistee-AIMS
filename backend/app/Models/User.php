<?php

namespace App\Models;

use App\Notifications\PasswordReset;
use App\Scopes\ModelFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, Billable;

    public static array $types = [
        'administrator',
        'client',
        'supervisor',
        'cleaner',
        'guest',
        'messenger',
        'accountant',
        'banned',
    ];

    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'phone',
        'address',
        'type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function locations()
    {
        return $this->hasMany(\App\Location::class, 'owner_id');
    }

    public function scopeFilter(Builder $query, ModelFilter $filter): Builder
    {
        return $filter->apply($query);
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new PasswordReset($token));
    }

    public static function updatePassword(string $token, string $password): void
    {
        $email = \App\Models\PasswordResets::getEntry($token)->email;
        $user = User::whereEmail($email)->first();
        $user->password = bcrypt($password);
        $user->save();
        \App\Models\PasswordResets::deleteEntry($email);
    }
}
