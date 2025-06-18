<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        if ($request->user()->hasRole('admin')) {
            return Inertia::render('admin/dashboard');
        }

        if ($request->user()->hasRole('student')) {
            return Inertia::render('student/dashboard');
        }

      
        return Inertia::render('dashboard');
    }
}
