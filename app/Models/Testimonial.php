<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Testimonial extends Model
{
    use HasTranslations;

    protected $fillable = ['client_name', 'client_role', 'avatar_url', 'message', 'order'];

    public array $translatable = ['message'];

    protected $casts = ['order' => 'integer'];
}
