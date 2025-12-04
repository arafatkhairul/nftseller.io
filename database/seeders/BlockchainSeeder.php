<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlockchainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blockchains = [
            [
                'name' => 'Ethereum',
                'logo' => 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
            ],
            [
                'name' => 'Polygon',
                'logo' => 'https://cryptologos.cc/logos/polygon-matic-logo.png',
            ],
            [
                'name' => 'Solana',
                'logo' => 'https://cryptologos.cc/logos/solana-sol-logo.png',
            ],
            [
                'name' => 'Binance Smart Chain',
                'logo' => 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
            ],
        ];

        foreach ($blockchains as $blockchain) {
            \App\Models\Blockchain::firstOrCreate(
                ['name' => $blockchain['name']],
                $blockchain
            );
        }
    }
}
