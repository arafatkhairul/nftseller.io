<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class P2pTransfer extends Model
{
    protected $fillable = [
        'order_id',
        'transfer_code',
        'partner_address',
        'partner_payment_method_id',
        'amount',
        'sender_address',
        'network',
        'status',
        'payment_completed_at',
        'release_timer_started_at',
        'auto_release_at',
        'appeal_reason',
        'appealed_at',
    ];

    protected $casts = [
        'payment_completed_at' => 'datetime',
        'release_timer_started_at' => 'datetime',
        'auto_release_at' => 'datetime',
        'appealed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class, 'partner_payment_method_id');
    }

    // Check if auto-release time has passed
    public function shouldAutoRelease(): bool
    {
        return $this->auto_release_at && now()->greaterThanOrEqualTo($this->auto_release_at) && $this->status === 'payment_completed';
    }

    // Get remaining time for current timer in seconds
    public function getRemainingTime(): ?int
    {
        if ($this->status === 'pending' && $this->created_at) {
            $deadlineMinutes = \App\Models\Setting::where('key', 'p2p_payment_deadline_minutes')->value('value') ?? 15;
            $endTime = $this->created_at->addMinutes((int)$deadlineMinutes);
            return max(0, now()->diffInSeconds($endTime, false));
        }

        if ($this->status === 'payment_completed' && $this->auto_release_at) {
            return max(0, now()->diffInSeconds($this->auto_release_at, false));
        }

        return null;
    }
}
