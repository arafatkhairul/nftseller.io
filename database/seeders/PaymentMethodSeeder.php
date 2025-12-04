<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            [
                'name' => 'Bank Transfer',
                'description' => 'Account Name: Opensea Ltd, Account No: 1234567890, Bank: City Bank',
                'is_active' => true,
                'icon' => 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
                'sort_order' => 1,
            ],
            [
                'name' => 'BKash',
                'description' => 'Personal: 01700000000',
                'is_active' => true,
                'icon' => 'https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png',
                'sort_order' => 2,
            ],
            [
                'name' => 'Nagad',
                'description' => 'Personal: 01800000000',
                'is_active' => true,
                'icon' => 'https://freelogopng.com/images/all_img/1679248787Nagad-Logo.png',
                'sort_order' => 3,
            ],
            [
                'name' => 'Rocket',
                'description' => 'Personal: 01900000000',
                'is_active' => true,
                'icon' => 'https://seeklogo.com/images/D/dutch-bangla-rocket-logo-B4D1CC458D-seeklogo.com.png',
                'sort_order' => 4,
            ],
        ];

        foreach ($methods as $method) {
            \App\Models\PaymentMethod::firstOrCreate(
                ['name' => $method['name']],
                $method
            );
        }
    }
}
