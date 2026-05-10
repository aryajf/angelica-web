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
                ->map(fn (Documentation $d) => $this->serializeDocumentation($d)),
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

        $order = 0;

        // Handle file uploads
        $files = $request->file('images', []);
        if (! empty($files)) {
            $firstImage = $this->storeUploadedFile($files[0]);
            $documentation->image_url = $firstImage;
            $documentation->save();

            foreach ($files as $file) {
                $url = $order === 0 ? $firstImage : $this->storeUploadedFile($file);
                $type = $this->detectFileType($file->getClientOriginalName());
                $documentation->images()->create([
                    'image_url' => $url,
                    'type' => $type,
                    'order' => $order++,
                ]);
            }
        } else {
            $documentation->image_url = '';
            $documentation->save();
        }

        // Handle Google Drive links
        $gdriveLinks = array_filter($data['gdrive_links'] ?? []);
        foreach ($gdriveLinks as $link) {
            $fileId = $this->extractGdriveFileId($link);
            if (! $fileId) {
                continue;
            }
            $embedUrl = "https://drive.google.com/file/d/{$fileId}/preview";
            $type = $this->detectGdriveType($link);

            // Use first gdrive as fallback image_url if no file uploads
            if ($documentation->image_url === '' && $type === 'gdrive_image') {
                $documentation->image_url = "https://drive.google.com/thumbnail?id={$fileId}&sz=w800";
                $documentation->save();
            }

            $documentation->images()->create([
                'image_url' => $embedUrl,
                'type' => $type,
                'order' => $order++,
            ]);
        }

        // Ensure image_url has a fallback
        if ($documentation->image_url === '') {
            $first = $documentation->images()->first();
            if ($first) {
                $documentation->image_url = $first->image_url;
                $documentation->save();
            }
        }

        return redirect()->route('admin.documentations.index')->with('success', 'Documentation added.');
    }

    public function edit(Documentation $documentation): Response
    {
        $documentation->load('images');

        return Inertia::render('Admin/Documentations/Form', [
            'documentation' => $this->serializeDocumentation($documentation),
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

        $hasNewFiles = $request->hasFile('images');
        $hasNewGdrive = ! empty(array_filter($data['gdrive_links'] ?? []));

        if ($hasNewFiles || $hasNewGdrive) {
            // Delete old media
            foreach ($documentation->images as $img) {
                if (! str_contains($img->image_url, 'drive.google.com')) {
                    $this->deleteImage($img->image_url);
                }
            }
            $documentation->images()->delete();

            if (! str_contains($documentation->image_url, 'drive.google.com')) {
                $this->deleteImage($documentation->image_url);
            }

            $order = 0;

            // Re-upload files
            if ($hasNewFiles) {
                $files = $request->file('images');
                $firstUrl = $this->storeUploadedFile($files[0]);
                $documentation->image_url = $firstUrl;

                foreach ($files as $file) {
                    $url = $order === 0 ? $firstUrl : $this->storeUploadedFile($file);
                    $type = $this->detectFileType($file->getClientOriginalName());
                    $documentation->images()->create([
                        'image_url' => $url,
                        'type' => $type,
                        'order' => $order++,
                    ]);
                }
            }

            // Re-add GDrive links
            $gdriveLinks = array_filter($data['gdrive_links'] ?? []);
            foreach ($gdriveLinks as $link) {
                $fileId = $this->extractGdriveFileId($link);
                if (! $fileId) {
                    continue;
                }
                $embedUrl = "https://drive.google.com/file/d/{$fileId}/preview";
                $type = $this->detectGdriveType($link);

                if (! $hasNewFiles && $order === 0 && $type === 'gdrive_image') {
                    $documentation->image_url = "https://drive.google.com/thumbnail?id={$fileId}&sz=w800";
                }

                $documentation->images()->create([
                    'image_url' => $embedUrl,
                    'type' => $type,
                    'order' => $order++,
                ]);
            }

            // Fallback image_url
            if (! $hasNewFiles && $documentation->image_url === '') {
                $first = $documentation->images()->first();
                if ($first) {
                    $documentation->image_url = $first->image_url;
                }
            }
        }

        $documentation->save();

        return redirect()->route('admin.documentations.index')->with('success', 'Documentation updated.');
    }

    public function destroy(Documentation $documentation): RedirectResponse
    {
        foreach ($documentation->images as $img) {
            if (! str_contains($img->image_url, 'drive.google.com')) {
                $this->deleteImage($img->image_url);
            }
        }
        if (! str_contains($documentation->image_url ?? '', 'drive.google.com')) {
            $this->deleteImage($documentation->image_url);
        }
        $documentation->delete();

        return back()->with('success', 'Documentation deleted.');
    }

    private function serializeDocumentation(Documentation $documentation): array
    {
        return [
            'id' => $documentation->id,
            'image_url' => $documentation->image_url,
            'image_urls' => $documentation->images->pluck('image_url')->values()->toArray(),
            'media' => $documentation->images->map(fn (DocumentationImage $img) => [
                'url' => $img->image_url,
                'type' => $img->type,
            ])->values()->toArray(),
            'title' => $documentation->getTranslations('title'),
            'description' => $documentation->getTranslations('description'),
            'started_at' => optional($documentation->started_at)->toDateString(),
            'ended_at' => optional($documentation->ended_at)->toDateString(),
            'order' => $documentation->order,
        ];
    }

    private function validateData(Request $request, bool $creating): array
    {
        $hasFiles = $request->hasFile('images');
        $hasGdrive = ! empty(array_filter($request->input('gdrive_links', [])));

        return $request->validate([
            'title.en' => ['required', 'string', 'max:160'],
            'title.id' => ['required', 'string', 'max:160'],
            'description.en' => ['required', 'string', 'max:600'],
            'description.id' => ['required', 'string', 'max:600'],
            'started_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'order' => ['nullable', 'integer', 'min:0'],
            'images' => [$creating && ! $hasGdrive ? 'required' : 'nullable', 'array'],
            'images.*' => ['file', 'max:20480'], // 20MB for videos
            'gdrive_links' => ['nullable', 'array'],
            'gdrive_links.*' => ['nullable', 'string', 'url'],
        ]);
    }

    private function storeUploadedFile($file): string
    {
        $path = $file->store('documentations', 'public');

        return Storage::url($path);
    }

    private function detectFileType(string $filename): string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

        return in_array($ext, $videoExts) ? 'video' : 'image';
    }

    private function detectGdriveType(string $link): string
    {
        // If the link contains hints about video, mark as gdrive_video
        $lower = strtolower($link);
        if (str_contains($lower, 'video') || str_contains($lower, '.mp4') || str_contains($lower, '.mov')) {
            return 'gdrive_video';
        }

        return 'gdrive_image';
    }

    private function extractGdriveFileId(string $url): ?string
    {
        // Matches: /file/d/{ID}/, /open?id={ID}, id={ID}
        if (preg_match('/\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $m)) {
            return $m[1];
        }
        if (preg_match('/[?&]id=([a-zA-Z0-9_-]+)/', $url, $m)) {
            return $m[1];
        }
        // Direct ID paste (no URL structure)
        if (preg_match('/^[a-zA-Z0-9_-]{20,}$/', trim($url))) {
            return trim($url);
        }

        return null;
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
