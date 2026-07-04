<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * GET /api/users
     */
    public function index()
    {
        $users = User::with(['roles'])->get();
        return response()->json($users);
    }

    /**
     * POST /api/users
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'background_photo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'roles.*' => 'string|exists:roles,id',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $photoPath = null;
            $backgroundPhotoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('users', 'public');
            }
            if ($request->hasFile('background_photo')) {
                $backgroundPhotoPath = $request->file('background_photo')->store('users/background_photo', 'public');
            }

            $validated['photo'] = asset('storage/' . $photoPath);
            $validated['background_photo'] = asset('storage/' . $backgroundPhotoPath);
            $validated['is_active'] = true;
            $user = User::create($validated);
            if (!empty($validated['roles'])) {
                $roles = Role::where('guard_name', 'api')
                    ->whereIn('id', $validated['roles'])
                    ->pluck('id')
                    ->toArray();
                $user->syncRoles($roles);
            }
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);
        });
    }

    /**
     * PUT /api/users/{id}
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $photoValidation = $request->hasFile('photo') ? 'image|mimes:jpg,jpeg,png,gif|max:2048' : 'nullable';
        $backgroundPhotoValidation = $request->hasFile('background_photo') ? 'image|mimes:jpg,jpeg,png,gif|max:2048' : 'nullable';

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:30',
            'photo' => $photoValidation,
            'background_photo' => $backgroundPhotoValidation,
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'roles.*' => 'exists:roles,id',
            'is_active' => 'boolean',
            'is_banned' => 'boolean',
        ]);

        return DB::transaction(function () use ($request, $validated, $user) {

            if ($request->hasFile('photo')) {

                if ($user->photo) {
                    $oldPath = str_replace(asset('storage') . '/', '', $user->photo);
                    Storage::disk('public')->delete($oldPath);
                }

                $photoPath = $request->file('photo')->store('users', 'public');
                $validated['photo'] = asset('storage/' . $photoPath);

            } elseif ($request->input('remove_photo') == '1') {

                if ($user->photo) {
                    $oldPath = str_replace(asset('storage') . '/', '', $user->photo);
                    Storage::disk('public')->delete($oldPath);
                }

                $validated['photo'] = null;
            } else {
                unset($validated['photo']);
            }

            // background
            if ($request->hasFile('background_photo')) {
                // Clean up old file if it exists
                if ($user->background_photo) {
                    $oldPath = str_replace(asset('storage') . '/', '', $user->background_photo);
                    Storage::disk('public')->delete($oldPath);
                }

                $photoPath = $request->file('background_photo')->store('user/background_photo', 'public');
                $validated['background_photo'] = asset('storage/' . $photoPath);

                // 2. Handle explicit background photo removal request
            } elseif ($request->input('remove_background_photo') == '1') {

                if ($user->background_photo) {
                    $oldPath = str_replace(asset('storage') . '/', '', $user->background_photo);
                    Storage::disk('public')->delete($oldPath);
                }

                $validated['background_photo'] = null;
                // 3. Keep the file completely untouched if neither condition was passed
            } else {
                unset($validated['background_photo']);
            }

            $user->update($validated);

            if (!empty($validated['roles'])) {
                $roles = Role::where('guard_name', 'api')
                    ->whereIn('id', $validated['roles'])
                    ->pluck('name')
                    ->toArray();

                $user->syncRoles($roles);
            }

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user->fresh()->load('roles')
            ]);
        });
    }


    /**
     * DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}