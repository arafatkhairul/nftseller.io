<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Art',
                'slug' => 'art',
                'description' => 'Digital art, crypto art, and generative art collections.',
                'is_active' => true,
            ],
            [
                'name' => 'Gaming',
                'slug' => 'gaming',
                'description' => 'In-game items, characters, and virtual assets.',
                'is_active' => true,
            ],
            [
                'name' => 'Music',
                'slug' => 'music',
                'description' => 'Audio NFTs, albums, and musical collectibles.',
                'is_active' => true,
            ],
            [
                'name' => 'Photography',
                'slug' => 'photography',
                'description' => 'Digital photography and captured moments.',
                'is_active' => true,
            ],
            [
                'name' => 'Virtual Worlds',
                'slug' => 'virtual-worlds',
                'description' => 'Virtual land, real estate, and metaverse assets.',
                'is_active' => true,
            ],
            [
                'name' => 'Sports',
                'slug' => 'sports',
                'description' => 'Sports collectibles, trading cards, and moments.',
                'is_active' => true,
            ],
            [
                'name' => 'Collectibles',
                'slug' => 'collectibles',
                'description' => 'Avatars, profile pictures (PFPs), and rare items.',
                'is_active' => true,
            ],
            [
                'name' => 'Domain Names',
                'slug' => 'domain-names',
                'description' => 'Blockchain domain names and decentralized identities.',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
