<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Documentation extends Model
{
    use HasTranslations;

    protected $fillable = ['image_url', 'title', 'description', 'order', 'started_at', 'ended_at'];

    public function images(): HasMany
    {
        return $this->hasMany(DocumentationImage::class)->orderBy('order');
    }

    public array $translatable = ['title', 'description'];

    protected $casts = [
        'order' => 'integer',
        'started_at' => 'date',
        'ended_at' => 'date',
    ];
}
