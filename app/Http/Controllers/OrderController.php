<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Get user's orders
     */
    public function userOrders()
    {
        $orders = auth()->user()->orders()
            ->with('nft')
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'nft_id' => $order->nft_id,
                    'nft_name' => $order->nft->name ?? 'Unknown',
                    'nft_image' => $order->nft->image_path ? asset('storage/' . $order->nft->image_path) : null,
                    'total_price' => $order->total_price,
                    'quantity' => $order->quantity,
                    'payment_method' => $order->payment_method,
                    'transaction_id' => $order->transaction_id,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                    'created_at_diff' => $order->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('user/orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Get admin view of all orders
     */
    public function adminOrders()
    {
        $orders = Order::with(['user', 'nft'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $order->user->id,
                    'user_name' => $order->user->name,
                    'user_email' => $order->user->email,
                    'nft_name' => $order->nft->name ?? 'Unknown',
                    'nft_image' => $order->nft->image_path ? asset('storage/' . $order->nft->image_path) : null,
                    'total_price' => $order->total_price,
                    'quantity' => $order->quantity,
                    'payment_method' => $order->payment_method,
                    'transaction_id' => $order->transaction_id,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('admin/orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Store a newly created order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nft_id' => 'required|exists:nfts,id',
            'total_price' => 'required|numeric|min:0.01',
            'quantity' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string',
            'transaction_id' => 'nullable|string',
        ]);

        // Generate unique order number
        $orderNumber = 'ORD-' . date('YmdHis') . '-' . auth()->id() . '-' . rand(100, 999);

        $order = Order::create([
            'user_id' => auth()->id(),
            'order_number' => $orderNumber,
            'nft_id' => $validated['nft_id'],
            'total_price' => $validated['total_price'],
            'quantity' => $validated['quantity'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'],
            'status' => 'pending',
        ]);

        // Load the NFT relationship for display
        $order->load('nft');

        // Format order data for frontend
        $orderData = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'nft_name' => $order->nft->name ?? 'Unknown',
            'nft_image' => $order->nft->image_path ? asset('storage/' . $order->nft->image_path) : null,
            'total_price' => $order->total_price,
            'quantity' => $order->quantity,
            'payment_method' => $order->payment_method,
            'transaction_id' => $order->transaction_id,
            'status' => $order->status,
            'created_at' => $order->created_at->format('Y-m-d H:i'),
        ];

        // Redirect to order confirmation page with order data flashed to session
        return redirect()->route('order-confirmation')->with('order', $orderData);
    }

    /**
     * Show single order details
     */
    public function show(Order $order)
    {
        // Check if user is authorized
        if ($order->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $orderData = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'nft_id' => $order->nft_id,
            'nft_name' => $order->nft->name ?? 'Unknown',
            'nft_image' => $order->nft->image_path ? asset('storage/' . $order->nft->image_path) : null,
            'total_price' => $order->total_price,
            'quantity' => $order->quantity,
            'payment_method' => $order->payment_method,
            'transaction_id' => $order->transaction_id,
            'status' => $order->status,
            'user_name' => $order->user->name,
            'user_email' => $order->user->email,
            'created_at' => $order->created_at->format('Y-m-d H:i'),
        ];

        return Inertia::render('order-details', [
            'order' => $orderData,
        ]);
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled,failed,sent',
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Order status updated successfully!');
    }
}
