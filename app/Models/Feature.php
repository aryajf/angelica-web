<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Feature extends Model
{
    use HasTranslations;

    protected $fillable = ['icon', 'title', 'description', 'order'];

    public array $translatable = ['title', 'description'];

    protected $casts = ['order' => 'integer'];
}
