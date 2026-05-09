<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('heroes', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('profession');
            $table->json('description');
            $table->string('avatar_url')->nullable();
            $table->string('cv_url')->nullable();
            $table->string('email')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_id')->nullable();
            $table->string('seo_description_en', 320)->nullable();
            $table->string('seo_description_id', 320)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heroes');
    }
};
