<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nft extends Model
{
    protected $fillable = [
        'name',
        'description',
        'image_path',
        'price',
        'blockchain',
        'contract_address',
        'token_id',
        'status',
        'creator_id',
        'views',
        'likes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'views' => 'integer',
        'likes' => 'integer',
    ];

    /**
     * Get the creator of the NFT
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
