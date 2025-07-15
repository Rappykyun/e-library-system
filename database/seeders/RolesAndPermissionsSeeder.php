<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
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
            'view users',
            'manage users',
            'track downloads',
            'view dashboard',
            'browse books',
            'download books',
            'view books',
            'bookmark books',
            'system settings',
            'manage course shelves',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // 🎓 STUDENT ROLE - Browse and use library only
        $studentRole = Role::findOrCreate('student', 'web');
        $studentRole->syncPermissions([
            'browse books',
            'download books',
            'view books',
            'bookmark books'
        ]);

        // 📚 LIBRARIAN ROLE - Manage books and categories + dashboard
        $librarianRole = Role::findOrCreate('librarian', 'web');
        $librarianRole->syncPermissions([
            // 'view dashboard',
            'upload books',
            'edit books',
            'delete books',
            'create categories',
            'update categories',
            'delete categories',
            'track downloads',
            // Plus all student permissions
            'browse books',
            'download books',
            'view books',
            'bookmark books'
        ]);

        // 👨‍🏫 FACULTY ROLE - Manage course shelves + student permissions
        $facultyRole = Role::findOrCreate('faculty', 'web');
        $facultyRole->syncPermissions([
            'manage course shelves',
            // Plus all student permissions
            'browse books',
            'download books',
            'view books',
            'bookmark books'
        ]);

        // 👑 ADMIN ROLE - Everything (highest level)
        $adminRole = Role::findOrCreate('admin', 'web');
        $adminRole->syncPermissions(Permission::all()); // Full access to everything

        // 🔥 Remove super_admin role if it exists
        $superAdminRole = Role::where('name', 'super_admin')->first();
        if ($superAdminRole) {
            // Move any super_admin users to admin
            $superAdminUsers = \App\Models\User::role('super_admin')->get();
            foreach ($superAdminUsers as $user) {
                $user->syncRoles(['admin']);
            }
            $superAdminRole->delete();
        }

        // Create default admin user if they don't exist
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Administrator',
                'password' => bcrypt('password'),
                'email_verified_at' => now()
            ]
        );
        $admin->syncRoles(['admin']);

        // Find another user to be a student, if available
        $studentUser = \App\Models\User::where('email', '!=', 'admin@example.com')->first();
        if ($studentUser) {
            $studentUser->syncRoles(['student']);
        }
    }
}