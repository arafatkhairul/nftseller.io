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
        Schema::table('nfts', function (Blueprint $table) {
            // Rename image_url to image_path
            if (Schema::hasColumn('nfts', 'image_url')) {
                $table->renameColumn('image_url', 'image_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nfts', function (Blueprint $table) {
            if (Schema::hasColumn('nfts', 'image_path')) {
                $table->renameColumn('image_path', 'image_url');
            }
        });
    }
};
