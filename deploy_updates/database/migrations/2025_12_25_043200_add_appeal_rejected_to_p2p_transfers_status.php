<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            // Add 'appeal_rejected' to the status ENUM for MySQL
            DB::statement("ALTER TABLE p2p_transfers MODIFY COLUMN status ENUM('pending', 'payment_completed', 'released', 'appealed', 'cancelled', 'appeal_rejected') DEFAULT 'pending'");
        }
        // SQLite doesn't support ENUM, it uses TEXT/VARCHAR which accepts any value
        // No action needed for SQLite
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            // Remove 'appeal_rejected' from the status ENUM for MySQL
            DB::statement("ALTER TABLE p2p_transfers MODIFY COLUMN status ENUM('pending', 'payment_completed', 'released', 'appealed', 'cancelled') DEFAULT 'pending'");
        }
    }
};
