<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documentation_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('documentation_id')->constrained()->cascadeOnDelete();
            $table->string('image_url');
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documentation_images');
    }
};
