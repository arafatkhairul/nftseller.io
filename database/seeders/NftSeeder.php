<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::where('email', 'admin@gmail.com')->first();
        $creators = \App\Models\User::where('role', 'user')->take(3)->get();
        $categories = \App\Models\Category::all();
        $artists = \App\Models\Artist::all();
        $blockchains = \App\Models\Blockchain::all();

        if ($categories->isEmpty() || $artists->isEmpty() || $blockchains->isEmpty()) {
            return;
        }

        $nfts = [
            [
                'name' => 'Cosmic Perspective #42',
                'description' => 'A journey through the cosmos exploring the depths of digital consciousness.',
                'image_path' => 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUqiZqbhIAdgM-1o6ScWx6NSv_jC53XNxbBNtsBa655J_yJJCmu3_s_u89D-puC1-q5sQ?auto=format&w=1000',
                'price' => 1.5,
                'quantity' => 1,
                'blockchain' => 'Ethereum',
                'status' => 'active',
                'rarity' => 'Legendary',
                'views' => 1250,
                'likes' => 342,
            ],
            [
                'name' => 'Abstract Mindset',
                'description' => 'Visual representation of thought processes in the digital age.',
                'image_path' => 'https://i.seadn.io/gae/2hXL8w_3_1-1_1?auto=format&w=1000',
                'price' => 0.8,
                'quantity' => 5,
                'blockchain' => 'Polygon',
                'status' => 'active',
                'rarity' => 'Rare',
                'views' => 850,
                'likes' => 156,
            ],
            [
                'name' => 'Cyber Punk 2077',
                'description' => 'Futuristic character design inspired by cyberpunk aesthetics.',
                'image_path' => 'https://i.seadn.io/gae/0_1_1?auto=format&w=1000',
                'price' => 2.5,
                'quantity' => 1,
                'blockchain' => 'Ethereum',
                'status' => 'active',
                'rarity' => 'Epic',
                'views' => 2100,
                'likes' => 567,
            ],
            [
                'name' => 'Digital Dreams',
                'description' => 'Surreal landscapes created using generative algorithms.',
                'image_path' => 'https://i.seadn.io/gae/1_1_1?auto=format&w=1000',
                'price' => 0.5,
                'quantity' => 10,
                'blockchain' => 'Solana',
                'status' => 'active',
                'rarity' => 'Common',
                'views' => 450,
                'likes' => 89,
            ],
            [
                'name' => 'Neon City Lights',
                'description' => 'Vibrant cityscape photography with neon accents.',
                'image_path' => 'https://i.seadn.io/gae/2_1_1?auto=format&w=1000',
                'price' => 1.2,
                'quantity' => 3,
                'blockchain' => 'Ethereum',
                'status' => 'active',
                'rarity' => 'Rare',
                'views' => 980,
                'likes' => 234,
            ],
        ];

        foreach ($nfts as $index => $nftData) {
            $category = $categories->random();
            $artist = $artists->random();
            $blockchain = $blockchains->where('name', $nftData['blockchain'])->first() ?? $blockchains->first();
            $creator = $creators->random() ?? $admin;

            \App\Models\Nft::create([
                'name' => $nftData['name'],
                'description' => $nftData['description'],
                'image_path' => $nftData['image_path'],
                'price' => $nftData['price'],
                'quantity' => $nftData['quantity'],
                'blockchain' => $nftData['blockchain'],
                'blockchain_id' => $blockchain->id,
                'contract_address' => '0x' . \Illuminate\Support\Str::random(40),
                'token_id' => (string) rand(1, 10000),
                'status' => $nftData['status'],
                'category_id' => $category->id,
                'artist_id' => $artist->id,
                'creator_id' => $creator->id,
                'rarity' => $nftData['rarity'],
                'views' => $nftData['views'],
                'likes' => $nftData['likes'],
            ]);
        }
    }
}
