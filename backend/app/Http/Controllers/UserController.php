<?php

namespace App\Http\Controllers;

use App\Models\PasswordResets;
use App\Models\User;
use App\Rules\EnsureOneAdmin;
use App\Rules\TokenFresh;
use App\Scopes\UserFilter;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    protected array $validationRulesForCreation = [
        'name'     => 'required|min:3',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|min:6|max:64',
    ];

    protected array $validationRulesForUpdate = [
        'name'     => 'min:3',
        'email'    => 'email|unique:users,email',
        'password' => 'min:6|max:64',
    ];

    protected array $validationRulesForPasswordResetRequest = [
        'email' => 'required|exists:users,email',
    ];

    protected array $validationRulesForPasswordReset = [
        'token'    => ['required', 'exists:password_resets,token'],
        'password' => 'required|min:6|max:64',
    ];

    protected array $updateable = [
        'administrator' => ['name', 'email', 'password', 'bio', 'phone', 'address', 'type'],
        'client'        => ['name', 'email', 'password', 'bio', 'phone', 'address'],
        'supervisor'    => ['name', 'email', 'password', 'bio', 'phone', 'address'],
        'cleaner'       => ['name', 'email', 'password', 'bio', 'phone', 'address'],
    ];

    private array $validationRulesForDeletion = [];

    public function __construct()
    {
        $this->validationRulesForCreation['type'] = 'in:' . implode(',', User::$types);
        $this->validationRulesForUpdate['type'][] = 'in:' . implode(',', User::$types);
        $this->validationRulesForUpdate['type'][] = new EnsureOneAdmin;
        $this->validationRulesForPasswordReset['token'][] = new TokenFresh;
    }

    // ─── Login ────────────────────────────────────────────────────────────────
    public function login(Request $request): \Illuminate\Http\JsonResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        /** @var User $user */
        $user  = Auth::user();
        $token = $user->createToken('aims-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    // ─── Register ─────────────────────────────────────────────────────────────
    public function register(Request $request): \Illuminate\Http\JsonResponse
    {
        if ($this->validationFails($request->all(), $this->validationRulesForCreation)) {
            return $this->validationResponse;
        }

        $user  = User::create($this->mutateForCreation($request->all()));
        $token = $user->createToken('aims-app')->plainTextToken;

        return response()->json([
            'message' => 'User Created!',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    protected function mutateForCreation(array $request = []): array
    {
        $request['password'] = bcrypt($request['password']);
        $request['type']     = env('DEV_EMAIL') === $request['email'] ? 'administrator' : 'client';
        return $request;
    }

    // ─── Logout ───────────────────────────────────────────────────────────────
    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout successful!']);
    }

    // ─── Me ───────────────────────────────────────────────────────────────────
    public function me(Request $request): \Illuminate\Http\JsonResponse
    {
        return response()->json($request->user());
    }

    // ─── List users (admin) ───────────────────────────────────────────────────
    public function index(UserFilter $filter): Response
    {
        $users = User::filter($filter)->paginate(20);
        return response($users, 200);
    }

    public function show(User $user): Response
    {
        return response($user, 200);
    }

    public function update(User $user, Request $request): mixed
    {
        $userType = Auth::user()->type;
        $allowed  = $this->updateable[$userType] ?? [];
        $valid_requests = $request->only($allowed);

        if ($this->validationFails($valid_requests, $this->validationRulesForUpdate)) {
            return $this->validationResponse;
        }

        $user->update($this->mutateForUpdate($valid_requests));
        return $this->updateSuccessResponse('User');
    }

    protected function mutateForUpdate(array $request = []): array
    {
        if (isset($request['password'])) {
            $request['password'] = bcrypt($request['password']);
        }
        return $request;
    }

    public function delete(User $user): mixed
    {
        if ($this->validationFails(['id' => $user->id], $this->validationRulesForDeletion)) {
            return $this->validationResponse;
        }
        $user->delete();
        return $this->deleteSuccessResponse('User');
    }

    // ─── Password Reset ───────────────────────────────────────────────────────
    public function requestPasswordReset(Request $request): Response
    {
        if ($this->validationFails($request->all(), $this->validationRulesForPasswordResetRequest)) {
            return $this->validationResponse;
        }

        $token = str()->random(32);
        PasswordResets::create(['email' => $request->get('email'), 'token' => $token]);
        User::whereEmail($request->get('email'))->first()->sendPasswordResetNotification($token);

        return response(['message' => 'Reset instructions sent']);
    }

    public function performPasswordReset(Request $request): Response
    {
        if ($this->validationFails($request->all(), $this->validationRulesForPasswordReset)) {
            return $this->validationResponse;
        }

        User::updatePassword($request->token, $request->password);
        return response(['message' => 'Password Updated'], 200);
    }

    // ─── Stripe ───────────────────────────────────────────────────────────────
    public function saveCard(Request $request): Response
    {
        $stripe_obj = $request->stripe;
        /** @var User $user */
        $user = Auth::user();

        if (strlen((string) $user->card_last_four) === 4) {
            $user->updateCard($stripe_obj['id']);
        } else {
            $user->createAsStripeCustomer();
        }

        return response($user, 200);
    }
}
