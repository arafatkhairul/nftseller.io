<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class P2pNetwork extends Model
{
    protected $fillable = [
        'name',
        'currency_symbol',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
