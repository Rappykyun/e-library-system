<?php

namespace App\Http\Controllers;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasRole('admin')) {
            return Inertia::render('admin/dashboard');
        }

        if ($request->user()->hasRole('student')) {
            return redirect()->route('student.books.index');
        }

      
        return Inertia::render('dashboard');
    }
}
