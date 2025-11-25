<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create the permission
        $permission = Permission::create(['name' => 'view enrolled courses']);

        // Assign it to the student role if it exists
        try {
            $studentRole = Role::findByName('student');
            $studentRole->givePermissionTo($permission);
        } catch (\Spatie\Permission\Exceptions\RoleDoesNotExist $e) {
            // Role doesn't exist yet, skip assignment
            // This will be handled in the seeder
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Permission::findByName('view enrolled courses')->delete();
    }
};
