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
        $totalRevenue = \App\Models\Order::where('status', 'completed')->sum('total_price') ?? 0;

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

        $totalRevenue = \App\Models\Order::where('status', 'completed')->sum('total_price') ?? 0;
        $revenueToday = \App\Models\Order::where('status', 'completed')
            ->whereDate('created_at', today())
            ->sum('total_price') ?? 0;

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
    public function users(\Illuminate\Http\Request $request)
    {
        $query = User::select('id', 'name', 'email', 'role', 'created_at', 'email_verified_at');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($user) {
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
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show single user details with transaction history
     */
    public function showUser(User $user)
    {
        $transactions = $user->orders()
            ->with(['nft', 'activeP2pTransfer'])
            ->latest()
            ->get()
            ->map(function ($order) {
                $p2p = $order->activeP2pTransfer;
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'nft_name' => $order->nft->name ?? 'Unknown',
                    'amount' => $order->total_price,
                    'payment_method' => $order->payment_method,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                    'sender_address' => $order->sender_address,
                    'transaction_id' => $order->transaction_id,
                    'partner_address' => $p2p ? $p2p->partner_address : null,
                    'p2p_network' => $p2p ? $p2p->network : null,
                ];
            });

        return Inertia::render('admin/user-details', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'joinedAt' => $user->created_at->format('Y-m-d'),
            ],
            'transactions' => $transactions,
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
        $settings = \App\Models\Setting::all()->pluck('value', 'key');
        return Inertia::render('admin/settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update settings
     */
    public function updateSettings(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'p2p_payment_deadline_minutes' => 'required|integer|min:1',
            'p2p_auto_release_minutes' => 'required|integer|min:1',
        ]);

        foreach ($validated as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
