<?php

namespace App\Http\Controllers;

use App\Models\Documentation;
use App\Models\DocumentationImage;
use App\Models\Feature;
use App\Models\Hero;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        $hero = Hero::current();

        return Inertia::render('Public/Home', [
            'hero' => [
                'name' => $hero->getTranslations('name'),
                'profession' => $hero->getTranslations('profession'),
                'description' => $hero->getTranslations('description'),
                'avatar_url' => $hero->avatar_url,
                'cv_url' => $hero->cv_url,
                'email' => $hero->email,
                'instagram_url' => $hero->instagram_url,
            ],
            'documentations' => Documentation::query()->orderBy('order')->with('images')->get()
                ->map(fn (Documentation $d) => [
                    'id' => $d->id,
                    'image_url' => $d->image_url,
                    'image_urls' => $d->images->pluck('image_url')->values()->toArray(),
                    'media' => $d->images->map(fn (DocumentationImage $img) => [
                        'url' => $img->image_url,
                        'type' => $img->type,
                    ])->values()->toArray(),
                    'title' => $d->getTranslations('title'),
                    'description' => $d->getTranslations('description'),
                    'started_at' => optional($d->started_at)->toDateString(),
                    'ended_at' => optional($d->ended_at)->toDateString(),
                ]),
            'features' => Feature::query()->orderBy('order')->get()
                ->map(fn (Feature $f) => [
                    'id' => $f->id,
                    'icon' => $f->icon,
                    'title' => $f->getTranslations('title'),
                    'description' => $f->getTranslations('description'),
                ]),
            'testimonials' => Testimonial::query()->orderBy('order')->get()
                ->map(fn (Testimonial $t) => [
                    'id' => $t->id,
                    'client_name' => $t->client_name,
                    'client_role' => $t->client_role,
                    'avatar_url' => $t->avatar_url,
                    'message' => $t->getTranslations('message'),
                ]),
        ]);
    }

    public function setLocale(Request $request, string $locale): RedirectResponse
    {
        abort_unless(in_array($locale, ['en', 'id'], true), 404);
        $request->session()->put('locale', $locale);

        return back();
    }
}
