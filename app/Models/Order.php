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
    /**
     * Get the NFT associated with the order
     */
    public function nft(): BelongsTo
    {
        return $this->belongsTo(Nft::class);
    }

    /**
     * Get the P2P transfers for the order
     */
    public function p2pTransfers()
    {
        return $this->hasMany(P2pTransfer::class);
    }

    /**
     * Get the active/latest P2P transfer
     */
    public function activeP2pTransfer()
    {
        return $this->hasOne(P2pTransfer::class)->latestOfMany();
    }
}
