<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HeroBannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Good Vibes Club',
                'creator' => 'GVC_Official',
                'is_verified' => true,
                'background_image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                'floor_price' => 0.592,
                'items' => 6968,
                'total_volume' => 8975.61,
                'listed_percentage' => 9.5,
                'featured_nfts' => [],
                'display_order' => 0,
                'is_active' => true,
            ],
            [
                'title' => 'CryptoPunks',
                'creator' => 'LarvaLabs',
                'is_verified' => true,
                'background_image' => 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                'floor_price' => 45.2,
                'items' => 10000,
                'total_volume' => 954821.73,
                'listed_percentage' => 1.2,
                'featured_nfts' => [],
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Bored Ape Yacht Club',
                'creator' => 'Yuga Labs',
                'is_verified' => true,
                'background_image' => 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                'floor_price' => 12.8,
                'items' => 10000,
                'total_volume' => 673420.12,
                'listed_percentage' => 2.8,
                'featured_nfts' => [],
                'display_order' => 2,
                'is_active' => true,
            ],
        ];

        // Note: background_image is set to null because we'll use external URLs
        // In production, you would upload actual images
        foreach ($banners as $banner) {
            \App\Models\HeroBanner::create($banner);
        }
    }
}
