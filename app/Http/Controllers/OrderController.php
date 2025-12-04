<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymentMethod;
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
            ->with(['nft', 'activeP2pTransfer'])
            ->latest()
            ->get()
            ->map(function ($order) {
                $activeTransfer = $order->activeP2pTransfer;
                $p2pData = null;

                if ($activeTransfer && !in_array($activeTransfer->status, ['cancelled', 'appeal_rejected'])) {
                    $p2pData = [
                        'id' => $activeTransfer->id,
                        'transfer_code' => $activeTransfer->transfer_code,
                        'partner_address' => $activeTransfer->partner_address,
                        'partner_payment_method_id' => $activeTransfer->partner_payment_method_id,
                        'amount' => $activeTransfer->amount,
                        'network' => $activeTransfer->network,
                        'status' => $activeTransfer->status,
                        'link' => route('p2p-transfer.show', ['code' => $activeTransfer->transfer_code]),
                    ];
                }

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
                    'active_p2p_transfer' => $p2pData,
                ];
            });

        $paymentMethods = PaymentMethod::where('is_active', true)
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'icon' => $method->icon,
                    'wallet_address' => $method->wallet_address,
                ];
            });

        $networks = \App\Models\P2pNetwork::where('is_active', true)
            ->get()
            ->map(function ($network) {
                return [
                    'id' => $network->id,
                    'name' => $network->name,
                    'currency_symbol' => $network->currency_symbol,
                ];
            });

        return Inertia::render('user/orders', [
            'orders' => $orders,
            'paymentMethods' => $paymentMethods,
            'networks' => $networks,
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

        // Fetch P2P transfer details if available
        $p2pTransfer = \App\Models\P2pTransfer::where('order_id', $order->id)->first();
        $p2pData = null;

        if ($p2pTransfer) {
            $p2pData = [
                'id' => $p2pTransfer->id,
                'transfer_code' => $p2pTransfer->transfer_code,
                'partner_address' => $p2pTransfer->partner_address,
                'amount' => $p2pTransfer->amount,
                'network' => $p2pTransfer->network,
                'status' => $p2pTransfer->status,
                'appeal_reason' => $p2pTransfer->appeal_reason,
                'appealed_at' => $p2pTransfer->appealed_at ? $p2pTransfer->appealed_at->format('Y-m-d H:i') : null,
            ];
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
            'p2p_transfer' => $p2pData,
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

        // If status is changing to completed, decrease NFT quantity
        if ($validated['status'] === 'completed' && $order->status !== 'completed') {
            $nft = $order->nft;
            if ($nft) {
                $nft->decrement('quantity', $order->quantity);
            }
        }

        $order->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Order status updated successfully!');
    }

    /**
     * Submit manual sent request with address
     */
    public function submitSentRequest(Request $request, Order $order)
    {
        // Ensure user owns order
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'sender_address' => 'required|string|max:255',
        ]);

        $order->update([
            'status' => 'pending_sent',
            'sender_address' => $validated['sender_address'],
        ]);

        return back()->with('success', 'Sent request submitted successfully. Admin will verify.');
    }

    /**
     * Admin: Get pending sent requests
     */
    public function adminPendingSent()
    {
        $orders = Order::where('status', 'pending_sent')
            ->with(['user', 'nft'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_name' => $order->user->name,
                    'user_email' => $order->user->email,
                    'nft_name' => $order->nft->name ?? 'Unknown',
                    'nft_image' => $order->nft->image_path ? asset('storage/' . $order->nft->image_path) : null,
                    'total_price' => $order->total_price,
                    'sender_address' => $order->sender_address,
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('admin/pending-sent', [
            'orders' => $orders,
        ]);
    }

    /**
     * Admin: Approve sent request
     */
    public function approveSentRequest($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'sent']);

        return back()->with('success', 'Order marked as sent successfully.');
    }

    /**
     * Admin: Reject sent request
     */
    public function rejectSentRequest($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'sent_rejected']);

        return back()->with('success', 'Sent request rejected.');
    }
}
