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

        // Assign it to the student role
        $studentRole = Role::findByName('student');
        if ($studentRole) {
            $studentRole->givePermissionTo($permission);
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
