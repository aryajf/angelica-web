<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeatureController extends Controller
{
    private const ICONS = ['Sparkle', 'PaintBrush', 'HeartStraight', 'Star', 'MagicWand', 'Sun', 'Coffee', 'Camera', 'Flower'];

    public function index(): Response
    {
        return Inertia::render('Admin/Features/Index', [
            'features' => Feature::query()->orderBy('order')->get()
                ->map(fn (Feature $f) => [
                    'id' => $f->id,
                    'icon' => $f->icon,
                    'title' => $f->getTranslations('title'),
                    'description' => $f->getTranslations('description'),
                    'order' => $f->order,
                ]),
            'icons' => self::ICONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Features/Form', [
            'feature' => null,
            'icons' => self::ICONS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $feature = new Feature;
        $feature->icon = $data['icon'];
        $feature->setTranslations('title', $data['title']);
        $feature->setTranslations('description', $data['description']);
        $feature->order = $data['order'] ?? Feature::query()->max('order') + 1;
        $feature->save();

        return redirect()->route('admin.features.index')->with('success', 'Feature added.');
    }

    public function edit(Feature $feature): Response
    {
        return Inertia::render('Admin/Features/Form', [
            'feature' => [
                'id' => $feature->id,
                'icon' => $feature->icon,
                'title' => $feature->getTranslations('title'),
                'description' => $feature->getTranslations('description'),
                'order' => $feature->order,
            ],
            'icons' => self::ICONS,
        ]);
    }

    public function update(Request $request, Feature $feature): RedirectResponse
    {
        $data = $this->validateData($request);

        $feature->icon = $data['icon'];
        $feature->setTranslations('title', $data['title']);
        $feature->setTranslations('description', $data['description']);
        $feature->order = $data['order'] ?? $feature->order;
        $feature->save();

        return redirect()->route('admin.features.index')->with('success', 'Feature updated.');
    }

    public function destroy(Feature $feature): RedirectResponse
    {
        $feature->delete();

        return back()->with('success', 'Feature deleted.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'icon' => ['required', 'string', 'in:'.implode(',', self::ICONS)],
            'title.en' => ['required', 'string', 'max:160'],
            'title.id' => ['required', 'string', 'max:160'],
            'description.en' => ['required', 'string', 'max:400'],
            'description.id' => ['required', 'string', 'max:400'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
