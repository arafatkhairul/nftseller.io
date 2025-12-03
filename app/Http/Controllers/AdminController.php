<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Show admin dashboard
     */
    /**
     * Show admin dashboard
     */
    public function dashboard()
    {
        $totalUsers = User::count();
        $totalOrders = \App\Models\Order::count();
        $totalRevenue = \App\Models\Order::where('status', 'completed')->sum('total_price');
        
        $averageOrderValue = \App\Models\Order::where('status', 'completed')->avg('total_price') ?? 0;
        $pendingOrders = \App\Models\Order::where('status', 'pending')->count();
        
        // User growth calculation (last 30 days)
        $usersLastMonth = User::where('created_at', '<', now()->subDays(30))->count();
        $userGrowth = $usersLastMonth > 0 
            ? (($totalUsers - $usersLastMonth) / $usersLastMonth) * 100 
            : 100;

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'averageOrderValue' => $averageOrderValue,
                'pendingOrders' => $pendingOrders,
                'userGrowth' => round($userGrowth, 1),
            ]
        ]);
    }

    /**
     * Show analytics page
     */
    public function analytics()
    {
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', today())->count();
        
        $totalOrders = \App\Models\Order::count();
        $ordersToday = \App\Models\Order::whereDate('created_at', today())->count();
        
        $totalRevenue = \App\Models\Order::where('status', 'completed')->sum('total_price');
        $revenueToday = \App\Models\Order::where('status', 'completed')
            ->whereDate('created_at', today())
            ->sum('total_price');

        // Last 7 days revenue chart data
        $revenueChart = \App\Models\Order::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => \Carbon\Carbon::parse($item->date)->format('M d'),
                    'total' => (float) $item->total,
                ];
            });

        // Fill in missing days with 0
        $chartData = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('M d');
            $found = $revenueChart->firstWhere('date', $date);
            $chartData->push([
                'name' => $date,
                'total' => $found ? $found['total'] : 0,
            ]);
        }

        return Inertia::render('admin/analytics', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'newUsersToday' => $newUsersToday,
                'totalOrders' => $totalOrders,
                'ordersToday' => $ordersToday,
                'totalRevenue' => $totalRevenue,
                'revenueToday' => $revenueToday,
            ],
            'chartData' => $chartData
        ]);
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
     * Update user details
     */
    public function updateUser(\Illuminate\Http\Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:user,admin',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Delete user
     */
    public function destroyUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    /**
     * Show settings page
     */
    public function settings()
    {
        return Inertia::render('admin/settings');
    }
}
