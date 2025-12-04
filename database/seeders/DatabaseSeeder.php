<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Seed hero banners
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            BlockchainSeeder::class,
            ArtistSeeder::class,
            PaymentMethodSeeder::class,
            HeroBannerSeeder::class,
            NftSeeder::class,
            OrderSeeder::class,
            P2pTransferSeeder::class,
            SupportTicketSeeder::class,
            SocialLinkSeeder::class,
            P2pNetworkSeeder::class,
        ]);
    }
}
