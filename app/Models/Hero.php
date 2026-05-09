<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Hero extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'profession',
        'description',
        'avatar_url',
        'cv_url',
        'email',
        'instagram_url',
        'seo_title_en',
        'seo_title_id',
        'seo_description_en',
        'seo_description_id',
    ];

    public array $translatable = ['name', 'profession', 'description'];

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'name' => ['en' => 'Angelica', 'id' => 'Angelica'],
            'profession' => ['en' => 'Creative Storyteller', 'id' => 'Pencerita Kreatif'],
            'description' => [
                'en' => 'Crafting joyful brand stories with a soft, golden touch.',
                'id' => 'Merangkai cerita brand yang ceria dengan sentuhan emas yang lembut.',
            ],
        ]);
    }
}
