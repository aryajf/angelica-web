<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documentation;
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
            'documentations' => Documentation::query()->orderBy('order')->get()
                ->map(fn (Documentation $d) => [
                    'id' => $d->id,
                    'image_url' => $d->image_url,
                    'title' => $d->getTranslations('title'),
                    'description' => $d->getTranslations('description'),
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
        $documentation->image_url = $this->storeImage($request);
        $documentation->save();

        return redirect()->route('admin.documentations.index')->with('success', 'Documentation added.');
    }

    public function edit(Documentation $documentation): Response
    {
        return Inertia::render('Admin/Documentations/Form', [
            'documentation' => [
                'id' => $documentation->id,
                'image_url' => $documentation->image_url,
                'title' => $documentation->getTranslations('title'),
                'description' => $documentation->getTranslations('description'),
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

        if ($request->hasFile('image')) {
            $this->deleteImage($documentation->image_url);
            $documentation->image_url = $this->storeImage($request);
        }

        $documentation->save();

        return redirect()->route('admin.documentations.index')->with('success', 'Documentation updated.');
    }

    public function destroy(Documentation $documentation): RedirectResponse
    {
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
            'order' => ['nullable', 'integer', 'min:0'],
            'image' => [$creating ? 'required' : 'nullable', 'image', 'max:4096'],
        ]);
    }

    private function storeImage(Request $request): string
    {
        $path = $request->file('image')->store('documentations', 'public');

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
