<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'nft_id',
        'total_price',
        'quantity',
        'payment_method',
        'transaction_id',
        'sender_address',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'quantity' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who placed the order
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the NFT associated with the order
     */
    public function nft(): BelongsTo
    {
        return $this->belongsTo(Nft::class);
    }
}
