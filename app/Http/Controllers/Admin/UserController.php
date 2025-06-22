<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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

        $actor = $request->user();   // the authenticated user making the change
        $newRole = $request->role;     // desired role for the target user

        // --------------------------------------------------------------
        // 1. Disallow non-super admins from changing their own role.
        // --------------------------------------------------------------
        if ($actor->id === $user->id && !$actor->hasRole('super_admin')) {
            return back()->withErrors(['role' => 'You cannot change your own role.']);
        }

        // --------------------------------------------------------------
        // 2. Protect super admins – only another super admin may edit.
        // --------------------------------------------------------------
        if ($user->hasRole('super_admin') && !$actor->hasRole('super_admin')) {
            return back()->withErrors(['role' => 'Only a super admin can modify another super admin.']);
        }

        // --------------------------------------------------------------
        // 3. Prevent regular admins from modifying *any* admin account.
        //    Only a super admin can do that.
        // --------------------------------------------------------------
        if ($user->hasRole('admin') && !$actor->hasRole('super_admin')) {
            return back()->withErrors(['role' => 'Only a super admin can modify an admin account.']);
        }

        // --------------------------------------------------------------
        // 4. Still keep the safeguard that at least one admin exists.
        // --------------------------------------------------------------
        if ($user->hasRole('admin') && User::role('admin')->count() === 1 && $newRole !== 'admin') {
            return back()->withErrors(['role' => 'Cannot remove the last admin role.']);
        }

        // All checks passed – apply the change
        $user->syncRoles([$newRole]);

        return redirect()->route('admin.users.index');
    }

    public function destroy(User $user)
    {
        // Prevent an admin from deleting their own account
        if (auth()->id() === $user->id) {
            return back()->withErrors(['general' => 'You cannot delete your own account.']);
        }

        // Optional: Add a policy for more complex authorization
        // Gate::authorize('delete', $user);

        $user->delete();

        return redirect()->route('admin.users.index');
    }
}