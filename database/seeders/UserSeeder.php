<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Super Admin',
                'role' => 'admin',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Creators
        $creators = [
            ['name' => 'Beeple', 'email' => 'beeple@art.com'],
            ['name' => 'Pak', 'email' => 'pak@art.com'],
            ['name' => 'XCOPY', 'email' => 'xcopy@art.com'],
            ['name' => 'Fewocious', 'email' => 'fewo@art.com'],
            ['name' => 'Tyler Hobbs', 'email' => 'tyler@art.com'],
        ];

        foreach ($creators as $creator) {
            \App\Models\User::firstOrCreate(
                ['email' => $creator['email']],
                [
                    'name' => $creator['name'],
                    'role' => 'user', // Assuming creators are regular users with extra permissions or just users
                    'password' => \Illuminate\Support\Facades\Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }

        // Regular Users / Collectors
        $collectors = [
            ['name' => 'CryptoWhale', 'email' => 'whale@crypto.com'],
            ['name' => 'NFTCollector', 'email' => 'collector@nft.com'],
            ['name' => 'MetaVerseExplorer', 'email' => 'explorer@meta.com'],
        ];

        foreach ($collectors as $collector) {
            \App\Models\User::firstOrCreate(
                ['email' => $collector['email']],
                [
                    'name' => $collector['name'],
                    'role' => 'user',
                    'password' => \Illuminate\Support\Facades\Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
