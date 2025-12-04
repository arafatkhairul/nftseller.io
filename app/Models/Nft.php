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
        'quantity',
        'blockchain',
        'blockchain_id',
        'contract_address',
        'token_id',
        'status',
        'creator_id',
        'views',
        'likes',
        'category_id',
        'artist_id',
        'rarity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }

    public function blockchainRelation(): BelongsTo
    {
        return $this->belongsTo(Blockchain::class, 'blockchain_id');
    }
}
