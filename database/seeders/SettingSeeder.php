<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Setting::firstOrCreate(
            ['key' => 'p2p_payment_deadline_minutes'],
            ['value' => '15']
        );

        \App\Models\Setting::firstOrCreate(
            ['key' => 'p2p_auto_release_minutes'],
            ['value' => '5']
        );
    }
}
