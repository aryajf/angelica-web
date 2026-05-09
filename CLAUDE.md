# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bilingual (EN / ID) personal portfolio + lightweight CMS. Public site is a one-page scroller (Hero → Gallery → Why Hire Me → Testimonials marquee → Footer). `/admin` is a session-auth CMS for the same content. Default credentials seed as `admin` / `admin`.

## Stack

- **Laravel 11.31+** on PHP 8.2+, **SQLite** (`database/database.sqlite`).
- **Inertia.js (laravel adapter) + React 18 + TypeScript** as the only view layer — there are no Blade pages for content, only the `resources/views/app.blade.php` Inertia root.
- **spatie/laravel-translatable** for JSON-cast translatable fields (`name`, `profession`, `description`, `title`, `message`).
- **tightenco/ziggy** exposes named routes to the frontend via `@routes`.
- **Tailwind 3.4** with a custom **gold** palette + **Quicksand** display font; cute / minimalist component classes (`btn-primary`, `card`, `pill`, `input`, `label`) live in `resources/css/app.css`.
- **Vite 6 + @vitejs/plugin-react + vite-plugin-pwa 1.x** (autoUpdate SW, precaches built assets, `navigateFallbackDenylist` excludes `/admin`, `/login`, `/storage`).
- **react-i18next** for static UI strings (`resources/js/locales/{en,id}.json`); DB content stays bilingual via Spatie.
- **Phosphor Icons** — only icons in `resources/js/lib/icons.ts` (`FEATURE_ICONS` map) are tree-shake-friendly. **Do not** `import * from '@phosphor-icons/react'` anywhere — that pulls a 5 MB barrel into the bundle. Add to the map and re-export via `resolveIcon()`.

## Common commands

```bash
composer dev                      # server + queue + pail + vite (one shot)

# individual
php artisan serve
npm run dev
npm run build                     # produces public/build + sw.js
npx tsc --noEmit                  # types ( npm run types )
./vendor/bin/pint                 # PHP style ( --test for check-only )
php artisan test                  # PHPUnit 11

# DB
php artisan migrate:fresh --seed  # rebuild + seed admin/admin and fixtures
php artisan storage:link          # required: avatars/CVs/images served from /storage
```

## Architecture

### Request flow & shared state

`bootstrap/app.php` appends two middleware to the `web` group:

1. `App\Http\Middleware\SetLocale` — reads `session('locale')`, falls back to `Accept-Language` (`en`/`id` only), then `app.locale`. Calls `app()->setLocale()` for the request.
2. `App\Http\Middleware\HandleInertiaRequests` — shares `auth.user`, `locale`, `availableLocales`, `flash`, and a computed **`seo` prop** (per-locale title + description from the `Hero` row's `seo_*` columns) to every Inertia response. The Blade root reads `$page['props']['seo']` for the initial `<title>` and `<meta name="description">` so SSR-less crawlers still get localized SEO.

The locale switcher (`Components/LanguageSwitcher`) hits `GET /locale/{locale}` (`PageController::setLocale`), which writes to session and `back()`s — Inertia re-fetches with the new locale.

### Translatable content pattern

Models declare `public array $translatable = [...]` and use `Spatie\Translatable\HasTranslations`. **Controllers always serialize via `getTranslations('field')`** (returns `{en, id}`) instead of accessor strings — the React side picks the active locale via `lib/utils.ts::pickTranslation`. Validation rules use dotted keys (`'title.en' => [...]`, `'title.id' => [...]`) and the controller calls `setTranslations('title', $data['title'])`.

### File uploads

Hero (`avatar`, `cv`), Documentation (`image`), Testimonial (`avatar`) all store on the `public` disk and persist `Storage::url(...)` strings. Each controller has a private helper that strips `/storage/` from the URL and calls `Storage::disk('public')->delete(...)` on replace/remove. `remove_avatar` / `remove_cv` boolean flags handle explicit deletes from the form.

Inertia file uploads use `useForm` with `forceFormData: true`. **For PUT/PATCH endpoints with files, include `_method: 'put'` in the form data and call `form.post(url, { forceFormData: true })`** — Laravel form-method spoofing. See `Pages/Admin/Documentations/Form.tsx` and `Testimonials/Form.tsx` for the canonical pattern. Pure JSON edits (Features) can use `form.put()` directly.

### Frontend layout

- `Layouts/PublicLayout.tsx` renders a sticky top navbar on `md+` and **transforms into a fixed bottom icon nav on mobile** (the cute app-shell feel).
- `Layouts/AdminLayout.tsx` is a left sidebar on `md+`, also collapses to a bottom icon nav on mobile.
- Both layouts mount `<SeoHead />` which reads `usePage().props.seo` and emits OG / Twitter meta.
- Bottom-nav anchor links use `#home`, `#work`, `#about`, `#testimonials` — keep section IDs stable when refactoring `Pages/Public/Home.tsx`.

### PWA

`vite.config.js` configures `VitePWA` with manifest icons under `public/icons/`. The SW is generated at build time only (`devOptions.enabled: false`) — `npm run dev` won't register one. `app.tsx` calls `registerSW({ immediate: true })` only in `import.meta.env.PROD`.

## Conventions

- TypeScript form interfaces **must not** include `[key: string]: unknown` — Inertia's `FormDataType<T>` constraint rejects it.
- Phosphor `Icon` type from `@phosphor-icons/react` is the right type for component-prop icon refs (not a hand-rolled `ComponentType<{size,weight}>`).
- New translatable copy goes in **both** `locales/en.json` and `locales/id.json` — the i18n init has `fallbackLng: 'en'` so missing ID keys silently fall back, which is easy to miss in review.
- Validation messages and content max-lengths are intentionally tight (e.g. `description.* max:600`) to keep the cute layout from breaking.
- Default seeded admin: name=`admin`, password=`admin`. **Always change before deploying** — this is fine for local/dev only.

## Laravel 11 reminders

This project uses the streamlined Laravel 11 layout: middleware/exceptions/routing all live in `bootstrap/app.php`; no `Http/Kernel.php` or `Console/Kernel.php`. Service providers register in `bootstrap/providers.php`. Health endpoint is `/up`.
