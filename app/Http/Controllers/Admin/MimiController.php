<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documentation;
use App\Models\Feature;
use App\Models\Hero;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MimiController extends Controller
{
    /**
     * Return summary stats for the dashboard.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'documentations' => Documentation::query()->count(),
            'features' => Feature::query()->count(),
            'testimonials' => Testimonial::query()->count(),
        ]);
    }

    /**
     * Search / list data across models that Mimi can talk about.
     */
    public function query(Request $request): JsonResponse
    {
        $type = $request->input('type', 'all');
        $search = $request->input('search', '');
        $locale = app()->getLocale();

        $result = [];

        if (in_array($type, ['all', 'testimonials'])) {
            $q = Testimonial::query()->orderBy('order');
            if ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('client_name', 'like', "%{$search}%")
                          ->orWhere('client_role', 'like', "%{$search}%")
                          ->orWhere('message', 'like', "%{$search}%");
                });
            }
            $result['testimonials'] = $q->limit(10)->get()->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->client_name,
                'role' => $t->client_role,
                'message' => $t->getTranslation('message', $locale),
            ]);
        }

        if (in_array($type, ['all', 'documentations'])) {
            $q = Documentation::query()->orderBy('order');
            if ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                });
            }
            $result['documentations'] = $q->limit(10)->get()->map(fn ($d) => [
                'id' => $d->id,
                'title' => $d->getTranslation('title', $locale),
                'description' => $d->getTranslation('description', $locale),
                'started_at' => $d->started_at?->format('Y-m-d'),
                'ended_at' => $d->ended_at?->format('Y-m-d'),
            ]);
        }

        if (in_array($type, ['all', 'features'])) {
            $q = Feature::query()->orderBy('order');
            if ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                });
            }
            $result['features'] = $q->limit(10)->get()->map(fn ($f) => [
                'id' => $f->id,
                'icon' => $f->icon,
                'title' => $f->getTranslation('title', $locale),
                'description' => $f->getTranslation('description', $locale),
            ]);
        }

        if (in_array($type, ['all', 'hero'])) {
            $hero = Hero::current();
            $result['hero'] = [
                'name' => $hero->getTranslation('name', $locale),
                'profession' => $hero->getTranslation('profession', $locale),
                'description' => $hero->getTranslation('description', $locale),
                'email' => $hero->email,
                'instagram' => $hero->instagram_url,
            ];
        }

        return response()->json($result);
    }
}
