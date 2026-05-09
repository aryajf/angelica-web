<?php

namespace App\Http\Middleware;

use App\Models\Hero;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => fn () => [
                'user' => $request->user()?->only('id', 'name', 'email'),
            ],
            'locale' => fn () => app()->getLocale(),
            'fallbackLocale' => fn () => config('app.fallback_locale'),
            'availableLocales' => ['en', 'id'],
            'flash' => fn () => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'seo' => fn () => $this->seo(),
            'ziggy' => fn () => [
                'url' => $request->url(),
            ],
        ]);
    }

    protected function seo(): array
    {
        $hero = Hero::query()->first();
        $locale = app()->getLocale();

        if (! $hero) {
            return [
                'title' => 'Angelica · Portfolio',
                'description' => 'Personal portfolio.',
            ];
        }

        return [
            'title' => $locale === 'id'
                ? ($hero->seo_title_id ?: $hero->getTranslation('name', 'id', false).' · Portfolio')
                : ($hero->seo_title_en ?: $hero->getTranslation('name', 'en', false).' · Portfolio'),
            'description' => $locale === 'id'
                ? ($hero->seo_description_id ?: $hero->getTranslation('description', 'id', false))
                : ($hero->seo_description_en ?: $hero->getTranslation('description', 'en', false)),
        ];
    }
}
