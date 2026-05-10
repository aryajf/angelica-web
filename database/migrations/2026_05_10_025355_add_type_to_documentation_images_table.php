<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documentation_images', function (Blueprint $table) {
            $table->string('type')->default('image')->after('image_url'); // image, video, gdrive_image, gdrive_video
        });
    }

    public function down(): void
    {
        Schema::table('documentation_images', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
