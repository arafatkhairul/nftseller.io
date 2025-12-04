<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class P2pTransferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = \App\Models\Order::all();
        $paymentMethods = \App\Models\PaymentMethod::all();
        
        if ($orders->isEmpty() || $paymentMethods->isEmpty()) {
            return;
        }

        // Create P2P transfers for some orders
        foreach ($orders->take(5) as $order) {
            $paymentMethod = $paymentMethods->random();
            
            // Generate random status
            $statuses = ['pending', 'payment_completed', 'released', 'appealed', 'cancelled'];
            $status = $statuses[array_rand($statuses)];

            $network = \App\Models\P2pNetwork::inRandomOrder()->first();

            \App\Models\P2pTransfer::create([
                'order_id' => $order->id,
                'transfer_code' => strtoupper(\Illuminate\Support\Str::random(12)),
                'partner_address' => '0x' . \Illuminate\Support\Str::random(40),
                'partner_payment_method_id' => $paymentMethod->id,
                'amount' => $order->total_price,
                'sender_address' => '0x' . \Illuminate\Support\Str::random(40),
                'network' => $network ? $network->name : 'Ethereum',
                'status' => $status,
                'created_at' => now()->subDays(rand(0, 30)),
            ]);
        }
    }
}
