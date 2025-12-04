<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blockchain extends Model
{
    protected $fillable = [
        'name',
        'logo',
    ];

    public function nfts()
    {
        return $this->hasMany(Nft::class);
    }
}
