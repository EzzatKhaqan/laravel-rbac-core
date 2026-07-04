<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
  public function index()
  {
    return response()->json(Permission::all());
  }

  public function store(Request $request)
  {
    $request->validate([
      'subject' => 'required',
      'action' => 'required'
    ]);

    $permission = Permission::create([
      'name' => $request->subject . '.' . $request->action,
      'guard_name' => 'api',
      'subject' => $request->subject,
      'action' => $request->action
    ]);

    return response()->json([
      "data" => $permission,
    ]);
  }

  public function update(Request $request, string $id)
  {
    $permission = Permission::find($id);

    if (!$permission) {
      return response()->json(['message' => 'Permission not found'], 404);
    }

    $request->validate([
      'subject' => 'required',
      'action' => 'required'
    ]);

    $permission->update([
      'name' => $request->subject . '.' . $request->action,
      'subject' => $request->subject,
      'action' => $request->action
    ]);

    return response()->json(['message' => 'Permission updated', 'data' => $permission]);
  }

  public function destroy($id)
  {
    $permission = Permission::find($id);

    if (!$permission) {
      return response()->json(['message' => 'Permission not found'], 404);
    }

    $permission->delete();

    return response()->json(['message' => 'Permission deleted']);
  }

}
