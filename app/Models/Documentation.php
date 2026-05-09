<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Documentation extends Model
{
    use HasTranslations;

    protected $fillable = ['image_url', 'title', 'description', 'order'];

    public array $translatable = ['title', 'description'];

    protected $casts = ['order' => 'integer'];
}
