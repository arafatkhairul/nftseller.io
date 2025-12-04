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
            'sender_address' => 'nullable|string',
            'network' => 'required|exists:p2p_networks,name',
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
            'transfer_code' => $transfer->transfer_code,
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
            'payment_deadline_minutes' => \App\Models\Setting::where('key', 'p2p_payment_deadline_minutes')->value('value') ?? 15,
            'auto_release_minutes' => \App\Models\Setting::where('key', 'p2p_auto_release_minutes')->value('value') ?? 5,
        ];

        return Inertia::render('p2p-transfer', [
            'transfer' => $transferData,
        ]);
    }

    /**
     * Mark payment as completed
     */
    public function markPaymentCompleted(Request $request, $code)
    {
        $transfer = P2pTransfer::where('transfer_code', $code)->firstOrFail();

        if ($transfer->status !== 'pending') {
            return back()->with('error', 'Transfer is not in pending status');
        }

        $now = now();
        $autoReleaseMinutes = \App\Models\Setting::where('key', 'p2p_auto_release_minutes')->value('value') ?? 5;
        $autoReleaseAt = $now->copy()->addMinutes((int)$autoReleaseMinutes);

        $transfer->update([
            'status' => 'payment_completed',
            'payment_completed_at' => $now,
            'release_timer_started_at' => $now,
            'auto_release_at' => $autoReleaseAt,
        ]);

        return back()->with('success', "Payment marked as completed. {$autoReleaseMinutes}-minute release timer started.");
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

        return redirect()->route('home')->with('success', 'Transfer released successfully!');
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

        // Update order status to appealed so it shows in the list
        $transfer->order->update(['status' => 'appealed']);

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
        $appeals = P2pTransfer::whereNotNull('appealed_at')
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
                    'status' => $transfer->status,
                    'appeal_reason' => $transfer->appeal_reason,
                    'appealed_at' => $transfer->appealed_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('admin/p2p-appeals/index', [
            'appeals' => $appeals,
        ]);
    }

    /**
     * Admin: Show appeal details
     */
    public function adminAppealShow($id)
    {
        $transfer = P2pTransfer::with(['order.nft', 'order.user', 'paymentMethod'])
            ->findOrFail($id);

        $transferData = [
            'id' => $transfer->id,
            'order_number' => $transfer->order->order_number,
            'user_name' => $transfer->order->user->name,
            'user_email' => $transfer->order->user->email,
            'nft_name' => $transfer->order->nft->name ?? 'Unknown',
            'nft_image' => $transfer->order->nft->image_path ? asset('storage/' . $transfer->order->nft->image_path) : null,
            'amount' => $transfer->amount,
            'network' => $transfer->network,
            'payment_method' => $transfer->paymentMethod->name,
            'partner_address' => $transfer->partner_address,
            'sender_address' => $transfer->sender_address,
            'status' => $transfer->status,
            'appeal_reason' => $transfer->appeal_reason,
            'appealed_at' => $transfer->appealed_at ? $transfer->appealed_at->format('Y-m-d H:i') : null,
            'created_at' => $transfer->created_at->format('Y-m-d H:i'),
        ];

        return Inertia::render('admin/p2p-appeals/show', [
            'appeal' => $transferData,
        ]);
    }

    /**
     * Admin: Resolve appeal
     */
    /**
     * Admin: Resolve appeal
     */
    public function resolveAppeal(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        $transfer = P2pTransfer::findOrFail($id);

        if ($transfer->status !== 'appealed') {
            return back()->with('error', 'Transfer is not appealed');
        }

        if ($validated['action'] === 'approve') {
            // Approve appeal: User can try again.
            // We cancel the current P2P transfer and set order status to appeal_approved
            $transfer->update(['status' => 'cancelled']);
            $transfer->order->update(['status' => 'appeal_approved']);
            $message = 'Appeal approved. User can now retry the transfer.';
        } else {
            // Reject appeal: Transfer failed/blocked.
            $transfer->update(['status' => 'appeal_rejected']);
            $transfer->order->update(['status' => 'appeal_rejected']);
            $message = 'Appeal rejected. Transfer marked as rejected.';
        }

        return back()->with('success', $message);
    }

    /**
     * Admin: Ask question (Create Support Ticket)
     */
    public function askQuestion(Request $request, $id)
    {
        $validated = $request->validate([
            'question' => 'required|string',
        ]);

        $transfer = P2pTransfer::with('order.user')->findOrFail($id);
        $user = $transfer->order->user;

        // Create Support Ticket
        $ticket = \App\Models\SupportTicket::create([
            'user_id' => $user->id,
            'ticket_unique_id' => '#' . strtoupper(Str::random(8)),
            'subject' => 'Question regarding P2P Transfer #' . $transfer->order->order_number,
            'priority' => 'high',
            'status' => 'open',
            'p2p_transfer_id' => $transfer->id,
        ]);

        // Add Admin Message
        \App\Models\SupportTicketMessage::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => auth()->id(), // Admin ID
            'message' => $validated['question'],
        ]);

        return back()->with('success', 'Question sent. Support ticket created.');
    }
}
