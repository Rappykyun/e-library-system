<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'upload books',
            'edit books',
            'delete books',
            'create categories',
            'update categories',
            'delete categories',
            'create tags',
            'update tags',
            'delete tags',
            'view users',
            'track downloads',
            'view dashboard',
            'browse books',
            'download books',
            'view books',
            'bookmark books',
        ];

        foreach ($permissions as $permission) {

            Permission::findOrCreate($permission, 'web');
        }

        // ------------------------------------------------------------------
        // Roles
        // ------------------------------------------------------------------
        $studentRole = Role::findOrCreate('student', 'web');
        $studentRole->syncPermissions(['browse books', 'download books', 'view books', 'bookmark books']);

        $adminRole = Role::findOrCreate('admin', 'web');
        $permissions = Permission::where('name', '!=', 'view users')->get();
        $adminRole->syncPermissions($permissions);

        $superAdminRole = Role::findOrCreate('super_admin', 'web');
        $superAdminRole->syncPermissions(Permission::all());

        $firstUser = \App\Models\User::first();
        if ($firstUser) {
            $firstUser->syncRoles(['super_admin']);
        }

        $owner = \App\Models\User::firstOrCreate(
            ['email' => 'owner@example.com'],
            ['name' => 'System Owner', 'password' => bcrypt('password')]
        );
        $owner->syncRoles(['super_admin']);
    }
}
