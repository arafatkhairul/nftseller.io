<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Show admin dashboard
     */
    public function dashboard()
    {
        return Inertia::render('admin/dashboard');
    }

    /**
     * Show analytics page
     */
    public function analytics()
    {
        return Inertia::render('admin/analytics');
    }

    /**
     * Show users management page with all users
     */
    public function users()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at', 'email_verified_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'joinedAt' => $user->created_at->format('Y-m-d'),
                    'status' => $user->email_verified_at ? 'Active' : 'Pending',
                ];
            });

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    /**
     * Show orders management page
     */
    public function orders()
    {
        return Inertia::render('admin/orders');
    }

    /**
     * Show settings page
     */
    public function settings()
    {
        return Inertia::render('admin/settings');
    }
}
