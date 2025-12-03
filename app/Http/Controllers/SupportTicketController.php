<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SupportTicketController extends Controller
{
    // User Methods
    public function index()
    {
        $tickets = SupportTicket::where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_unique_id' => $ticket->ticket_unique_id,
                    'subject' => $ticket->subject,
                    'status' => $ticket->status,
                    'priority' => $ticket->priority,
                    'created_at' => $ticket->created_at->format('Y-m-d H:i'),
                    'last_updated' => $ticket->updated_at->diffForHumans(),
                ];
            });

        return Inertia::render('support/index', [
            'tickets' => $tickets
        ]);
    }

    public function create()
    {
        return Inertia::render('support/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'message' => 'required|string',
        ]);

        $ticket = SupportTicket::create([
            'user_id' => auth()->id(),
            'ticket_unique_id' => '#' . strtoupper(Str::random(8)),
            'subject' => $request->subject,
            'priority' => $request->priority,
            'status' => 'open',
        ]);

        SupportTicketMessage::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);

        return redirect()->route('support.show', $ticket->id)->with('success', 'Ticket created successfully.');
    }

    public function show($id)
    {
        $ticket = SupportTicket::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        
        $messages = $ticket->messages()->with('user')->oldest()->get()->map(function ($message) {
            return [
                'id' => $message->id,
                'user_name' => $message->user->name,
                'user_avatar' => $message->user->profile_photo_url, // Assuming standard Laravel/Jetstream
                'message' => $message->message,
                'is_admin' => $message->user->role === 'admin',
                'created_at' => $message->created_at->format('Y-m-d H:i'),
                'is_me' => $message->user_id === auth()->id(),
            ];
        });

        return Inertia::render('support/show', [
            'ticket' => [
                'id' => $ticket->id,
                'ticket_unique_id' => $ticket->ticket_unique_id,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'created_at' => $ticket->created_at->format('Y-m-d H:i'),
            ],
            'messages' => $messages,
        ]);
    }

    public function reply(Request $request, $id)
    {
        $ticket = SupportTicket::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        $request->validate([
            'message' => 'required|string',
        ]);

        SupportTicketMessage::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);

        $ticket->touch(); // Update updated_at

        return back()->with('success', 'Reply sent successfully.');
    }

    // Admin Methods
    public function adminIndex()
    {
        $tickets = SupportTicket::with('user')
            ->latest()
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_unique_id' => $ticket->ticket_unique_id,
                    'subject' => $ticket->subject,
                    'user_name' => $ticket->user->name,
                    'status' => $ticket->status,
                    'priority' => $ticket->priority,
                    'created_at' => $ticket->created_at->format('Y-m-d H:i'),
                    'last_updated' => $ticket->updated_at->diffForHumans(),
                ];
            });

        return Inertia::render('admin/support/index', [
            'tickets' => $tickets
        ]);
    }

    public function adminShow($id)
    {
        $ticket = SupportTicket::with('user')->findOrFail($id);

        $messages = $ticket->messages()->with('user')->oldest()->get()->map(function ($message) {
            return [
                'id' => $message->id,
                'user_name' => $message->user->name,
                'user_avatar' => $message->user->profile_photo_url,
                'message' => $message->message,
                'is_admin' => $message->user->role === 'admin',
                'created_at' => $message->created_at->format('Y-m-d H:i'),
                'is_me' => $message->user_id === auth()->id(),
            ];
        });

        return Inertia::render('admin/support/show', [
            'ticket' => [
                'id' => $ticket->id,
                'ticket_unique_id' => $ticket->ticket_unique_id,
                'subject' => $ticket->subject,
                'user_name' => $ticket->user->name,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'created_at' => $ticket->created_at->format('Y-m-d H:i'),
            ],
            'messages' => $messages,
        ]);
    }

    public function adminReply(Request $request, $id)
    {
        $ticket = SupportTicket::findOrFail($id);

        $request->validate([
            'message' => 'required|string',
        ]);

        SupportTicketMessage::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);

        $ticket->touch();

        return back()->with('success', 'Reply sent successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $ticket = SupportTicket::findOrFail($id);

        $request->validate([
            'status' => 'required|in:open,in_progress,closed',
        ]);

        $ticket->update(['status' => $request->status]);

        return back()->with('success', 'Status updated successfully.');
    }
}
