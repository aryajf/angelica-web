<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hero;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    public function edit(): Response
    {
        $hero = Hero::current();

        return Inertia::render('Admin/Hero', [
            'hero' => [
                'id' => $hero->id,
                'name' => $hero->getTranslations('name'),
                'profession' => $hero->getTranslations('profession'),
                'description' => $hero->getTranslations('description'),
                'avatar_url' => $hero->avatar_url,
                'cv_url' => $hero->cv_url,
                'email' => $hero->email,
                'instagram_url' => $hero->instagram_url,
                'seo_title_en' => $hero->seo_title_en,
                'seo_title_id' => $hero->seo_title_id,
                'seo_description_en' => $hero->seo_description_en,
                'seo_description_id' => $hero->seo_description_id,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name.en' => ['required', 'string', 'max:120'],
            'name.id' => ['required', 'string', 'max:120'],
            'profession.en' => ['required', 'string', 'max:160'],
            'profession.id' => ['required', 'string', 'max:160'],
            'description.en' => ['required', 'string', 'max:600'],
            'description.id' => ['required', 'string', 'max:600'],
            'email' => ['nullable', 'email', 'max:160'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'seo_title_en' => ['nullable', 'string', 'max:120'],
            'seo_title_id' => ['nullable', 'string', 'max:120'],
            'seo_description_en' => ['nullable', 'string', 'max:300'],
            'seo_description_id' => ['nullable', 'string', 'max:300'],
            'avatar' => ['nullable', 'image', 'max:4096'],
            'cv' => ['nullable', 'file', 'mimes:pdf', 'max:8192'],
            'remove_avatar' => ['nullable', 'boolean'],
            'remove_cv' => ['nullable', 'boolean'],
        ]);

        $hero = Hero::current();

        $hero->setTranslations('name', $data['name']);
        $hero->setTranslations('profession', $data['profession']);
        $hero->setTranslations('description', $data['description']);

        $hero->fill([
            'email' => $data['email'] ?? null,
            'instagram_url' => $data['instagram_url'] ?? null,
            'seo_title_en' => $data['seo_title_en'] ?? null,
            'seo_title_id' => $data['seo_title_id'] ?? null,
            'seo_description_en' => $data['seo_description_en'] ?? null,
            'seo_description_id' => $data['seo_description_id'] ?? null,
        ]);

        if ($request->boolean('remove_avatar') && $hero->avatar_url) {
            $this->deletePublicAsset($hero->avatar_url);
            $hero->avatar_url = null;
        }

        if ($request->hasFile('avatar')) {
            if ($hero->avatar_url) {
                $this->deletePublicAsset($hero->avatar_url);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $hero->avatar_url = Storage::url($path);
        }

        if ($request->boolean('remove_cv') && $hero->cv_url) {
            $this->deletePublicAsset($hero->cv_url);
            $hero->cv_url = null;
        }

        if ($request->hasFile('cv')) {
            if ($hero->cv_url) {
                $this->deletePublicAsset($hero->cv_url);
            }
            $path = $request->file('cv')->store('cv', 'public');
            $hero->cv_url = Storage::url($path);
        }

        $hero->save();

        return back()->with('success', 'Hero updated.');
    }

    private function deletePublicAsset(?string $url): void
    {
        if (! $url) {
            return;
        }
        $relative = ltrim(str_replace('/storage/', '', parse_url($url, PHP_URL_PATH) ?? ''), '/');
        if ($relative !== '' && Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }
    }
}
