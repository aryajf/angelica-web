<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => Testimonial::query()->orderBy('order')->get()
                ->map(fn (Testimonial $t) => [
                    'id' => $t->id,
                    'client_name' => $t->client_name,
                    'client_role' => $t->client_role,
                    'avatar_url' => $t->avatar_url,
                    'message' => $t->getTranslations('message'),
                    'order' => $t->order,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Testimonials/Form', [
            'testimonial' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $testimonial = new Testimonial;
        $testimonial->fill([
            'client_name' => $data['client_name'],
            'client_role' => $data['client_role'] ?? null,
            'order' => $data['order'] ?? Testimonial::query()->max('order') + 1,
        ]);
        $testimonial->setTranslations('message', $data['message']);

        if ($request->hasFile('avatar')) {
            $testimonial->avatar_url = Storage::url($request->file('avatar')->store('testimonials', 'public'));
        }

        $testimonial->save();

        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonial added.');
    }

    public function edit(Testimonial $testimonial): Response
    {
        return Inertia::render('Admin/Testimonials/Form', [
            'testimonial' => [
                'id' => $testimonial->id,
                'client_name' => $testimonial->client_name,
                'client_role' => $testimonial->client_role,
                'avatar_url' => $testimonial->avatar_url,
                'message' => $testimonial->getTranslations('message'),
                'order' => $testimonial->order,
            ],
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $data = $this->validateData($request);

        $testimonial->fill([
            'client_name' => $data['client_name'],
            'client_role' => $data['client_role'] ?? null,
            'order' => $data['order'] ?? $testimonial->order,
        ]);
        $testimonial->setTranslations('message', $data['message']);

        if ($request->hasFile('avatar')) {
            $this->deleteAvatar($testimonial->avatar_url);
            $testimonial->avatar_url = Storage::url($request->file('avatar')->store('testimonials', 'public'));
        } elseif ($request->boolean('remove_avatar')) {
            $this->deleteAvatar($testimonial->avatar_url);
            $testimonial->avatar_url = null;
        }

        $testimonial->save();

        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $this->deleteAvatar($testimonial->avatar_url);
        $testimonial->delete();

        return back()->with('success', 'Testimonial deleted.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'client_name' => ['required', 'string', 'max:120'],
            'client_role' => ['nullable', 'string', 'max:160'],
            'message.en' => ['required', 'string', 'max:600'],
            'message.id' => ['required', 'string', 'max:600'],
            'order' => ['nullable', 'integer', 'min:0'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'remove_avatar' => ['nullable', 'boolean'],
        ]);
    }

    private function deleteAvatar(?string $url): void
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
