<?php

namespace App\Http\Controllers;

use App\Models\P2pTransfer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class P2pTransferController extends Controller
{
    /**
     * Create a new P2P transfer
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'partner_address' => 'required|string',
            'partner_payment_method_id' => 'required|exists:payment_methods,id',
            'amount' => 'required|numeric|min:0.01',
            'sender_address' => 'required|string',
            'network' => 'required|string',
        ]);

        // Generate unique transfer code
        $transferCode = Str::random(32);

        $transfer = P2pTransfer::create([
            'order_id' => $validated['order_id'],
            'transfer_code' => $transferCode,
            'partner_address' => $validated['partner_address'],
            'partner_payment_method_id' => $validated['partner_payment_method_id'],
            'amount' => $validated['amount'],
            'sender_address' => $validated['sender_address'],
            'network' => $validated['network'],
            'status' => 'pending',
        ]);

        // Generate the transfer link
        $link = route('p2p-transfer.show', ['code' => $transferCode]);

        return response()->json([
            'success' => true,
            'link' => $link,
            'transfer_id' => $transfer->id,
        ]);
    }

    /**
     * Show P2P transfer page
     */
    public function show($code)
    {
        $transfer = P2pTransfer::where('transfer_code', $code)
            ->with(['order.nft', 'paymentMethod'])
            ->firstOrFail();

        // Check for auto-release
        if ($transfer->shouldAutoRelease()) {
            $transfer->update(['status' => 'released']);
        }

        $transferData = [
            'id' => $transfer->id,
            'order_id' => $transfer->order_id,
            'order_number' => $transfer->order->order_number,
            'nft_name' => $transfer->order->nft->name ?? 'Unknown',
            'nft_image' => $transfer->order->nft->image_path ? asset('storage/' . $transfer->order->nft->image_path) : null,
            'partner_address' => $transfer->partner_address,
            'payment_method' => $transfer->paymentMethod->name,
            'payment_method_icon' => $transfer->paymentMethod->icon,
            'amount' => $transfer->amount,
            'sender_address' => $transfer->sender_address,
            'network' => $transfer->network,
            'status' => $transfer->status,
            'remaining_time' => $transfer->getRemainingTime(),
            'created_at' => $transfer->created_at->format('Y-m-d H:i'),
        ];

        return Inertia::render('p2p-transfer', [
            'transfer' => $transferData,
        ]);
    }

    /**
     * Mark payment as completed
     */
    public function markPaymentCompleted(Request $request, $id)
    {
        $transfer = P2pTransfer::findOrFail($id);

        if ($transfer->status !== 'pending') {
            return back()->with('error', 'Transfer is not in pending status');
        }

        $now = now();
        $autoReleaseAt = $now->copy()->addMinutes(5);

        $transfer->update([
            'status' => 'payment_completed',
            'payment_completed_at' => $now,
            'release_timer_started_at' => $now,
            'auto_release_at' => $autoReleaseAt,
        ]);

        return back()->with('success', 'Payment marked as completed. 5-minute release timer started.');
    }

    /**
     * Release the transfer
     */
    public function release($id)
    {
        $transfer = P2pTransfer::findOrFail($id);

        if ($transfer->status !== 'payment_completed') {
            return back()->with('error', 'Transfer cannot be released');
        }

        $transfer->update(['status' => 'released']);

        // Update order status to sent
        $transfer->order->update(['status' => 'sent']);

        return redirect()->route('orders.index')->with('success', 'Transfer released successfully!');
    }

    /**
     * Appeal the transfer
     */
    public function appeal(Request $request, $id)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $transfer = P2pTransfer::findOrFail($id);

        if ($transfer->status !== 'payment_completed') {
            return back()->with('error', 'Transfer cannot be appealed');
        }

        $transfer->update([
            'status' => 'appealed',
            'appeal_reason' => $validated['reason'],
            'appealed_at' => now(),
        ]);

        return back()->with('success', 'Appeal submitted successfully. Admin will review your case.');
    }

    /**
     * Get transfer status (for polling)
     */
    public function getStatus($id)
    {
        $transfer = P2pTransfer::findOrFail($id);

        // Check for auto-release
        if ($transfer->shouldAutoRelease()) {
            $transfer->update(['status' => 'released']);
            $transfer->order->update(['status' => 'sent']);
        }

        return response()->json([
            'status' => $transfer->status,
            'remaining_time' => $transfer->getRemainingTime(),
        ]);
    }

    /**
     * Admin: Get all appealed transfers
     */
    public function adminAppeals()
    {
        $appeals = P2pTransfer::where('status', 'appealed')
            ->with(['order.nft', 'order.user', 'paymentMethod'])
            ->latest('appealed_at')
            ->get()
            ->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'order_number' => $transfer->order->order_number,
                    'user_name' => $transfer->order->user->name,
                    'user_email' => $transfer->order->user->email,
                    'nft_name' => $transfer->order->nft->name ?? 'Unknown',
                    'amount' => $transfer->amount,
                    'network' => $transfer->network,
                    'appeal_reason' => $transfer->appeal_reason,
                    'appealed_at' => $transfer->appealed_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('admin/p2p-appeals', [
            'appeals' => $appeals,
        ]);
    }

    /**
     * Admin: Resolve appeal
     */
    public function resolveAppeal(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|in:release,cancel',
        ]);

        $transfer = P2pTransfer::findOrFail($id);

        if ($transfer->status !== 'appealed') {
            return back()->with('error', 'Transfer is not appealed');
        }

        if ($validated['action'] === 'release') {
            $transfer->update(['status' => 'released']);
            $transfer->order->update(['status' => 'sent']);
            $message = 'Transfer released successfully';
        } else {
            $transfer->update(['status' => 'cancelled']);
            $message = 'Transfer cancelled successfully';
        }

        return back()->with('success', $message);
    }
}
