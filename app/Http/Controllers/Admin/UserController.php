<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::with('roles')->latest()->paginate(10),
            'roles' => Role::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', Rule::exists('roles', 'name')],
        ]);

        $actor = $request->user();
        $newRole = $request->role;

        // ✅ Simplified: Only admins can change roles
        if (!$actor->hasRole('admin')) {
            return back()->withErrors(['role' => 'Only administrators can change user roles.']);
        }

        // ✅ Prevent admin from changing their own role
        if ($actor->id === $user->id) {
            return back()->withErrors(['role' => 'You cannot change your own role.']);
        }

        // ✅ Ensure at least one admin exists
        if ($user->hasRole('admin') && User::role('admin')->count() === 1 && $newRole !== 'admin') {
            return back()->withErrors(['role' => 'Cannot remove the last administrator.']);
        }

        $user->syncRoles([$newRole]);

        return redirect()->route('admin.users.index')->with('success', 'User role updated successfully.');
    }

    public function destroy(User $user)
    {
        $actor = auth()->user();

        // Prevent admin from deleting their own account
        if ($actor->id === $user->id) {
            return back()->withErrors(['general' => 'You cannot delete your own account.']);
        }

        // Prevent deleting the last admin
        if ($user->hasRole('admin') && User::role('admin')->count() === 1) {
            return back()->withErrors(['general' => 'Cannot delete the last administrator.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}