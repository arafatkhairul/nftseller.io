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
        // For SQLite, we need to recreate the table to change the CHECK constraint
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('orders', function (Blueprint $table) {
                // We can't easily modify enum/check in SQLite without dropping/recreating
                // But Laravel's schema builder might handle it if we just redefine it
                // However, to be safe and ensure data retention:
                
                // 1. Rename old table
                // 2. Create new table with new schema
                // 3. Copy data
                // 4. Drop old table
            });

            // Let's try the standard Laravel way first, it might work if doctrine/dbal is present
            // But for ENUMs in SQLite, Laravel often creates a CHECK constraint.
            
            // A safer raw SQL approach for SQLite to update the CHECK constraint:
            // But since we are in dev, let's just modify the column definition.
            // Note: 'change()' requires doctrine/dbal.
            
            // Since we want to be robust:
            
            // 1. Create temporary table with new schema
            Schema::create('orders_temp', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('order_number')->unique();
                $table->unsignedBigInteger('nft_id');
                $table->foreign('nft_id')->references('id')->on('nfts')->onDelete('cascade');
                $table->decimal('total_price', 15, 2);
                $table->decimal('quantity', 10, 2)->default(1);
                $table->string('payment_method')->default('crypto');
                $table->string('transaction_id')->nullable();
                // Add 'sent' to the enum
                $table->enum('status', ['pending', 'completed', 'cancelled', 'failed', 'sent'])->default('pending');
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->index('user_id');
                $table->index('status');
                $table->index('created_at');
            });

            // 2. Copy data
            DB::statement('INSERT INTO orders_temp SELECT * FROM orders');

            // 3. Drop old table
            Schema::drop('orders');

            // 4. Rename temp table
            Schema::rename('orders_temp', 'orders');
        } else {
            // For MySQL/PostgreSQL
            Schema::table('orders', function (Blueprint $table) {
                $table->enum('status', ['pending', 'completed', 'cancelled', 'failed', 'sent'])->default('pending')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting is complex for SQLite, skipping for now as 'sent' is additive
    }
};
