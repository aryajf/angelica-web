<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documentation;
use App\Models\DocumentationImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Documentations/Index', [
            'documentations' => Documentation::query()->orderBy('order')->with('images')->get()
                ->map(fn (Documentation $d) => [
                    'id' => $d->id,
                    'image_url' => $d->image_url,
                    'image_urls' => $d->images->pluck('image_url')->values()->toArray(),
                    'title' => $d->getTranslations('title'),
                    'description' => $d->getTranslations('description'),
                    'started_at' => optional($d->started_at)->toDateString(),
                    'ended_at' => optional($d->ended_at)->toDateString(),
                    'order' => $d->order,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Documentations/Form', [
            'documentation' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request, creating: true);

        $documentation = new Documentation;
        $documentation->setTranslations('title', $data['title']);
        $documentation->setTranslations('description', $data['description']);
        $documentation->order = $data['order'] ?? Documentation::query()->max('order') + 1;
        $documentation->started_at = $data['started_at'] ?? null;
        $documentation->ended_at = $data['ended_at'] ?? null;

        // Use the first uploaded image as the legacy image_url
        $firstImage = $this->storeImage($request->file('images')[0]);
        $documentation->image_url = $firstImage;
        $documentation->save();

        // Store all images in the documentation_images table
        foreach ($request->file('images', []) as $i => $file) {
            $url = $i === 0 ? $firstImage : Storage::url($file->store('documentations', 'public'));
            $documentation->images()->create([
                'image_url' => $url,
                'order' => $i,
            ]);
        }

        return redirect()->route('admin.documentations.index')->with('success', 'Documentation added.');
    }

    public function edit(Documentation $documentation): Response
    {
        $documentation->load('images');

        return Inertia::render('Admin/Documentations/Form', [
            'documentation' => [
                'id' => $documentation->id,
                'image_url' => $documentation->image_url,
                'image_urls' => $documentation->images->pluck('image_url')->values()->toArray(),
                'title' => $documentation->getTranslations('title'),
                'description' => $documentation->getTranslations('description'),
                'started_at' => optional($documentation->started_at)->toDateString(),
                'ended_at' => optional($documentation->ended_at)->toDateString(),
                'order' => $documentation->order,
            ],
        ]);
    }

    public function update(Request $request, Documentation $documentation): RedirectResponse
    {
        $data = $this->validateData($request, creating: false);

        $documentation->setTranslations('title', $data['title']);
        $documentation->setTranslations('description', $data['description']);
        $documentation->order = $data['order'] ?? $documentation->order;
        $documentation->started_at = $data['started_at'] ?? null;
        $documentation->ended_at = $data['ended_at'] ?? null;

        if ($request->hasFile('images')) {
            // Delete old images
            foreach ($documentation->images as $img) {
                $this->deleteImage($img->image_url);
            }
            $documentation->images()->delete();
            $this->deleteImage($documentation->image_url);

            $files = $request->file('images');
            $firstUrl = Storage::url($files[0]->store('documentations', 'public'));
            $documentation->image_url = $firstUrl;

            foreach ($files as $i => $file) {
                $url = $i === 0 ? $firstUrl : Storage::url($file->store('documentations', 'public'));
                $documentation->images()->create([
                    'image_url' => $url,
                    'order' => $i,
                ]);
            }
        }

        $documentation->save();

        return redirect()->route('admin.documentations.index')->with('success', 'Documentation updated.');
    }

    public function destroy(Documentation $documentation): RedirectResponse
    {
        foreach ($documentation->images as $img) {
            $this->deleteImage($img->image_url);
        }
        $this->deleteImage($documentation->image_url);
        $documentation->delete();

        return back()->with('success', 'Documentation deleted.');
    }

    private function validateData(Request $request, bool $creating): array
    {
        return $request->validate([
            'title.en' => ['required', 'string', 'max:160'],
            'title.id' => ['required', 'string', 'max:160'],
            'description.en' => ['required', 'string', 'max:600'],
            'description.id' => ['required', 'string', 'max:600'],
            'started_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'order' => ['nullable', 'integer', 'min:0'],
            'images' => [$creating ? 'required' : 'nullable', 'array'],
            'images.*' => ['image', 'max:4096'],
        ]);
    }

    private function storeImage($file): string
    {
        $path = $file->store('documentations', 'public');

        return Storage::url($path);
    }

    private function deleteImage(?string $url): void
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
