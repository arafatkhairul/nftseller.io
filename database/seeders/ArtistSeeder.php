<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artists = [
            [
                'name' => 'Beeple',
                'avatar' => 'https://pbs.twimg.com/profile_images/1460737478330720258/0-0-0-0_400x400.jpg',
                'is_verified' => true,
            ],
            [
                'name' => 'Pak',
                'avatar' => 'https://pbs.twimg.com/profile_images/1359628795551989762/0-0-0-0_400x400.jpg',
                'is_verified' => true,
            ],
            [
                'name' => 'XCOPY',
                'avatar' => 'https://pbs.twimg.com/profile_images/1480665975551381504/0-0-0-0_400x400.jpg',
                'is_verified' => true,
            ],
            [
                'name' => 'Fewocious',
                'avatar' => 'https://pbs.twimg.com/profile_images/1455272755551381504/0-0-0-0_400x400.jpg',
                'is_verified' => true,
            ],
        ];

        foreach ($artists as $artist) {
            \App\Models\Artist::firstOrCreate(
                ['name' => $artist['name']],
                $artist
            );
        }
    }
}
