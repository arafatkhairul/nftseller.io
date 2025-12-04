<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hero_banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('creator');
            $table->boolean('is_verified')->default(false);
            $table->string('background_image')->nullable();
            $table->decimal('floor_price', 10, 3)->default(0);
            $table->integer('items')->default(0);
            $table->decimal('total_volume', 15, 2)->default(0);
            $table->decimal('listed_percentage', 5, 2)->default(0);
            $table->json('featured_nfts')->nullable(); // Array of NFT IDs or image URLs
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_banners');
    }
};
