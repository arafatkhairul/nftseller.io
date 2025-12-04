<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupportTicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::where('role', 'user')->get();
        
        if ($users->isEmpty()) {
            return;
        }

        $issues = [
            'Payment Issue' => 'I made a payment but it is not showing up in my account.',
            'Account Verification' => 'How long does it take to get verified?',
            'NFT Transfer' => 'I cannot transfer my NFT to another wallet.',
            'Bug Report' => 'I found a bug on the profile page.',
        ];

        foreach ($users as $user) {
            // 50% chance to create a ticket
            if (rand(0, 1)) {
                $subject = array_rand($issues);
                $message = $issues[$subject];
                
                $ticket = \App\Models\SupportTicket::create([
                    'user_id' => $user->id,
                    'subject' => $subject,
                    'status' => rand(0, 1) ? 'open' : 'closed',
                    'priority' => rand(0, 1) ? 'high' : 'medium',
                    'ticket_unique_id' => 'TKT-' . strtoupper(\Illuminate\Support\Str::random(8)),
                ]);

                // Create initial message
                \App\Models\SupportTicketMessage::create([
                    'support_ticket_id' => $ticket->id,
                    'user_id' => $user->id,
                    'message' => $message,
                ]);

                // Create admin response if closed
                if ($ticket->status === 'closed') {
                    $admin = \App\Models\User::where('role', 'admin')->first();
                    if ($admin) {
                        \App\Models\SupportTicketMessage::create([
                            'support_ticket_id' => $ticket->id,
                            'user_id' => $admin->id,
                            'message' => 'This issue has been resolved. Thank you for contacting support.',
                        ]);
                    }
                }
            }
        }
    }
}
