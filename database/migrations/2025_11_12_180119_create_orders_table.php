<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->unsignedBigInteger('nft_id');
            $table->foreign('nft_id')->references('id')->on('nfts')->onDelete('cascade');
            $table->decimal('total_price', 15, 2);
            $table->decimal('quantity', 10, 2)->default(1);
            $table->string('payment_method')->default('crypto'); // crypto, card, etc
            $table->string('transaction_id')->nullable();
            $table->enum('status', ['pending', 'completed', 'cancelled', 'failed'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
