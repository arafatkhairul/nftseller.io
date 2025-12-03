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
            // 1. Create temporary table with new schema
            Schema::create('orders_temp_v2', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('order_number')->unique();
                $table->unsignedBigInteger('nft_id');
                $table->foreign('nft_id')->references('id')->on('nfts')->onDelete('cascade');
                $table->decimal('total_price', 15, 2);
                $table->decimal('quantity', 10, 2)->default(1);
                $table->string('payment_method')->default('crypto');
                $table->string('transaction_id')->nullable();
                // Add 'appealed' and 'processing' to the enum
                $table->enum('status', ['pending', 'completed', 'cancelled', 'failed', 'sent', 'appealed', 'processing'])->default('pending');
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->index('user_id');
                $table->index('status');
                $table->index('created_at');
            });

            // 2. Copy data
            // Note: We need to be careful if columns match exactly. They should.
            DB::statement('INSERT INTO orders_temp_v2 SELECT * FROM orders');

            // 3. Drop old table
            Schema::drop('orders');

            // 4. Rename temp table
            Schema::rename('orders_temp_v2', 'orders');
        } else {
            // For MySQL/PostgreSQL
            Schema::table('orders', function (Blueprint $table) {
                $table->enum('status', ['pending', 'completed', 'cancelled', 'failed', 'sent', 'appealed', 'processing'])->default('pending')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting is complex for SQLite, skipping for now
    }
};
