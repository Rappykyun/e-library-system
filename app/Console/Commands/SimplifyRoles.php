<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class SimplifyRoles extends Command
{
    protected $signature = 'roles:simplify';
    protected $description = 'Simplify role structure to Admin -> Librarian -> Student';

    public function handle()
    {
        // Move super_admin users to admin
        $superAdmins = User::role('super_admin')->get();
        foreach ($superAdmins as $user) {
            $user->syncRoles(['admin']);
            $this->info("Converted {$user->name} from super_admin to admin");
        }

        // Remove super_admin role
        $superAdminRole = Role::where('name', 'super_admin')->first();
        if ($superAdminRole) {
            $superAdminRole->delete();
            $this->info("Removed super_admin role");
        }

        $this->info("Role simplification complete!");
        $this->info("Current structure: Admin -> Librarian -> Student");
    }
}