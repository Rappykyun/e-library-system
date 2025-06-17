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
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
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
            Permission::create(['name' => $permission]);
        }

        // create roles and assign created permissions
        $studentRole = Role::create(['name' => 'student'])
            ->givePermissionTo(['browse books', 'download books', 'view books', 'bookmark books']);

        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());
    }
}
