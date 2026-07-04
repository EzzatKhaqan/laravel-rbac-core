<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('rbac_token')->plainTextToken;
        $user->update(['last_login_at' => now(), 'last_login_ip' => $request->ip()]);
        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function abilities(Request $request)
    {
        $user = Auth::user();

        return $user->roles()
            ->with('permissions:id,name,subject,action')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->unique(fn($permission) => $permission->subject . '.' . $permission->action)
            ->map(fn($permission) => [
                'action' => $permission->action,
                'subject' => $permission->subject,
            ])
            ->values();
    }

    public function getProfile()
    {
        $user = Auth::user()->load(['roles']);

        return response()->json(['user' => $user], 200);
    }

    public function validateToken(Request $request)
    {
        return response()->json([
            'valid' => true,
            'user' => $request->user(),
        ]);
    }
}