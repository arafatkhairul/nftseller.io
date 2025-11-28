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
        Schema::create('p2p_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('transfer_code')->unique(); // Unique code for the link
            
            // Partner's payment details
            $table->string('partner_address');
            $table->unsignedBigInteger('partner_payment_method_id');
            
            // Sender's payment details
            $table->decimal('amount', 10, 2);
            $table->string('sender_address');
            $table->string('network');
            
            // Status tracking
            $table->enum('status', ['pending', 'payment_completed', 'released', 'appealed', 'cancelled'])->default('pending');
            
            // Timer tracking
            $table->timestamp('payment_completed_at')->nullable();
            $table->timestamp('release_timer_started_at')->nullable();
            $table->timestamp('auto_release_at')->nullable();
            
            // Appeal
            $table->text('appeal_reason')->nullable();
            $table->timestamp('appealed_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('transfer_code');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p2p_transfers');
    }
};
