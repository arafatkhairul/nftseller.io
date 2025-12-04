<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroBanner extends Model
{
    protected $fillable = [
        'title',
        'creator',
        'is_verified',
        'background_image',
        'floor_price',
        'items',
        'total_volume',
        'listed_percentage',
        'featured_nfts',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'featured_nfts' => 'array',
        'floor_price' => 'decimal:3',
        'total_volume' => 'decimal:2',
        'listed_percentage' => 'decimal:2',
    ];
}
