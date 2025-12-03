<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active'];

    public function nfts()
    {
        return $this->hasMany(Nft::class);
    }
}
