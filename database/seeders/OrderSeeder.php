<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::where('role', 'user')->get();
        $nfts = \App\Models\Nft::all();
        $paymentMethods = \App\Models\PaymentMethod::all();

        if ($users->isEmpty() || $nfts->isEmpty() || $paymentMethods->isEmpty()) {
            return;
        }

        // Create 10 random orders
        for ($i = 0; $i < 10; $i++) {
            $user = $users->random();
            $nft = $nfts->random();
            $paymentMethod = $paymentMethods->random();
            $quantity = rand(1, min(3, $nft->quantity));
            $totalPrice = $nft->price * $quantity;
            
            // Generate random status based on probability
            $rand = rand(1, 100);
            if ($rand <= 60) $status = 'completed';
            elseif ($rand <= 80) $status = 'pending';
            elseif ($rand <= 90) $status = 'processing';
            else $status = 'cancelled';

            \App\Models\Order::create([
                'user_id' => $user->id,
                'nft_id' => $nft->id,
                'quantity' => $quantity,
                'total_price' => $totalPrice,
                'payment_method' => $paymentMethod->name,
                'transaction_id' => 'TXN' . strtoupper(\Illuminate\Support\Str::random(10)),
                'status' => $status,
                'sender_address' => $status !== 'pending' ? '0x' . \Illuminate\Support\Str::random(40) : null,
                'order_number' => 'ORD-' . strtoupper(\Illuminate\Support\Str::random(8)),
                'created_at' => now()->subDays(rand(0, 30)),
            ]);
        }
    }
}
