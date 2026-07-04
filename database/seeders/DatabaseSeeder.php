<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Create Roles
        |--------------------------------------------------------------------------
        */

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'api',
        ]);

        $sellerRole = Role::firstOrCreate([
            'name' => 'seller',
            'guard_name' => 'api',
        ]);

        $customerRole = Role::firstOrCreate([
            'name' => 'customer',
            'guard_name' => 'api',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Create Permissions
        |--------------------------------------------------------------------------
        */

        $permissions = collect([
            ['name' => 'dashboard.view', 'subject' => 'dashboard', 'action' => 'view'],

            ['name' => 'user.view', 'subject' => 'user', 'action' => 'view'],
            ['name' => 'user.create', 'subject' => 'user', 'action' => 'create'],
            ['name' => 'user.edit', 'subject' => 'user', 'action' => 'edit'],
            ['name' => 'user.delete', 'subject' => 'user', 'action' => 'delete'],

            ['name' => 'permission.view', 'subject' => 'permission', 'action' => 'view'],
            ['name' => 'permission.create', 'subject' => 'permission', 'action' => 'create'],
            ['name' => 'permission.edit', 'subject' => 'permission', 'action' => 'edit'],
            ['name' => 'permission.delete', 'subject' => 'permission', 'action' => 'delete'],

            ['name' => 'role.view', 'subject' => 'role', 'action' => 'view'],
            ['name' => 'role.create', 'subject' => 'role', 'action' => 'create'],
            ['name' => 'role.edit', 'subject' => 'role', 'action' => 'edit'],
            ['name' => 'role.delete', 'subject' => 'role', 'action' => 'delete'],
        ])->map(function ($permission) {
            return Permission::firstOrCreate(
                [
                    'name' => $permission['name'],
                    'guard_name' => 'api',
                ],
                [
                    'subject' => $permission['subject'],
                    'action' => $permission['action'],
                ]
            );
        });

        /*
        |--------------------------------------------------------------------------
        | Assign Permissions to Admin Role
        |--------------------------------------------------------------------------
        */

        $adminRole->syncPermissions($permissions);

        /*
        |--------------------------------------------------------------------------
        | Create Admin User
        |--------------------------------------------------------------------------
        */

        $admin = User::firstOrCreate(
            [
                'email' => 'admin@ezzat.com',
            ],
            [
                'first_name' => 'Admin',
                'last_name' => 'Admin',
                'username' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Assign Role
        |--------------------------------------------------------------------------
        */

        $admin->assignRole($adminRole);
    }
}