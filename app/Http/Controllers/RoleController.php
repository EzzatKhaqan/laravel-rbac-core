<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
  public function index()
  {
    return response()->json([
      'data' => Role::with(['permissions'])->get()
    ]);
  }
  public function store(Request $request)
  {
    $request->validate([
      'name' => 'required|unique:roles,name',
      'permissions' => 'nullable|array',
    ]);
    return DB::transaction(function () use ($request) {

      $role = Role::create([
        'name' => $request->name,
        'guard_name' => 'api',
      ]);

      $role->syncPermissions($request->permissions);

      return response()->json([
        'data' => $role->load('permissions')
      ]);

    });
  }

  public function update(Request $request, Role $role)
  {
    $request->validate([
      'name' => 'required',
      'permissions' => 'nullable|array',
    ]);

    return DB::transaction(function () use ($request, $role) {

      $role->update([
        'name' => $request->name,
      ]);

      if ($request->has('permissions')) {
        $role->syncPermissions($request->permissions);
      }

      return response()->json([
        'data' => $role->load('permissions')
      ]);
    });
  }

  public function destroy(string $id)
  {
    $role = Role::find($id);

    if (!$role) {
      return response()->json(['message' => 'Role not found'], 404);
    }

    $role->delete();

    return response()->json(['message' => 'Role deleted']);
  }

}