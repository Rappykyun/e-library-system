<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
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

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'role' => [
                'required',
                'string',
                Rule::exists('roles', 'name')->where(function ($query) {
                    // Allow assigning any role EXCEPT 'admin'
                    return $query->where('name', '!=', 'admin');
                })
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role using spatie/laravel-permission
        $user->assignRole($request->role);

        // Optional: Send a welcome/notification email to the user
        // Mail::to($user)->send(new WelcomeEmail($request->password));

        return Redirect::route('admin.users.index')->with('success', 'User created successfully.');
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