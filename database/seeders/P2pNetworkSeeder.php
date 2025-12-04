<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class P2pNetworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $networks = [
            [
                'name' => 'TRC20',
                'currency_symbol' => 'USDT',
                'is_active' => true,
            ],
            [
                'name' => 'ERC20',
                'currency_symbol' => 'ETH',
                'is_active' => true,
            ],
            [
                'name' => 'BEP20',
                'currency_symbol' => 'BNB',
                'is_active' => true,
            ],
            [
                'name' => 'Polygon',
                'currency_symbol' => 'MATIC',
                'is_active' => true,
            ],
            [
                'name' => 'Solana',
                'currency_symbol' => 'SOL',
                'is_active' => true,
            ],
            [
                'name' => 'Bitcoin',
                'currency_symbol' => 'BTC',
                'is_active' => true,
            ],
        ];

        foreach ($networks as $network) {
            \App\Models\P2pNetwork::firstOrCreate(
                ['name' => $network['name']],
                $network
            );
        }
    }
}
