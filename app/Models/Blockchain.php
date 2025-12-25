<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blockchain extends Model
{
    protected $fillable = [
        'name',
        'logo',
        'exchange_rate',
    ];

    public function nfts()
    {
        return $this->hasMany(Nft::class);
    }
}
