<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocialLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $links = [
            [
                'platform' => 'Twitter',
                'url' => 'https://twitter.com/opensea',
                'icon' => 'twitter',
                'is_active' => true,
            ],
            [
                'platform' => 'Discord',
                'url' => 'https://discord.gg/opensea',
                'icon' => 'discord',
                'is_active' => true,
            ],
            [
                'platform' => 'Instagram',
                'url' => 'https://instagram.com/opensea',
                'icon' => 'instagram',
                'is_active' => true,
            ],
            [
                'platform' => 'Youtube',
                'url' => 'https://youtube.com/opensea',
                'icon' => 'youtube',
                'is_active' => true,
            ],
            [
                'platform' => 'Telegram',
                'url' => 'https://t.me/opensea',
                'icon' => 'telegram',
                'is_active' => true,
            ],
        ];

        foreach ($links as $link) {
            \App\Models\SocialLink::firstOrCreate(
                ['platform' => $link['platform']],
                $link
            );
        }
    }
}
