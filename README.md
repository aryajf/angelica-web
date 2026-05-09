# Angelica · Portfolio

A cute, minimalist, gold-themed personal portfolio with a built-in CMS and full English / Indonesian internationalization. Public site for visitors, `/admin` for the owner — everything translatable, mobile-first, PWA-ready.

## Highlights

- **Bilingual everywhere** — UI strings via `react-i18next`, content fields via `spatie/laravel-translatable` (JSON columns).
- **Cute & minimalist** Tailwind theme: gold palette, soft shadows, rounded corners, Quicksand display font, Phosphor duotone icons.
- **Responsive shell** — clean top navbar on desktop, app-style fixed bottom icon bar on mobile.
- **CMS** — CRUD for hero, gallery, "why hire me" features, testimonials. Avatar/CV uploads. Password change.
- **PWA** out of the box (`vite-plugin-pwa`) with installable manifest and offline asset caching.
- **SEO** — per-locale `<title>` and `<meta description>` rendered by the server, plus OG / Twitter meta.
- **Type-safe frontend** (TypeScript + Inertia React) with lazy-loaded images.

## Tech stack

| Layer       | Choice                                             |
|-------------|----------------------------------------------------|
| Backend     | Laravel 11 · PHP 8.2+                              |
| Frontend    | Inertia.js + React 18 + TypeScript + Vite 6        |
| Styling     | Tailwind CSS 3.4 (custom gold theme + Quicksand)   |
| Icons       | `@phosphor-icons/react`                            |
| i18n        | `react-i18next` (UI) + `spatie/laravel-translatable` (DB) |
| Routing     | `tightenco/ziggy` (named routes in JS)             |
| PWA         | `vite-plugin-pwa` 1.x                              |
| Database    | SQLite                                             |

## Quick start

```bash
# 1. Install
composer install
npm install

# 2. Env + key
cp .env.example .env
php artisan key:generate

# 3. Database
touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan storage:link

# 4. Dev
composer dev   # runs php artisan serve + queue + pail + vite together
# or individually:
#   php artisan serve
#   npm run dev
```

Visit `http://127.0.0.1:8000`. Admin login at `/login`.

### Default admin credentials

```
username: admin
password: admin
```

⚠️ **Change immediately before deploying.** Sign in → `/admin/profile` → set a new password.

## Project shape

```
app/
├── Http/
│   ├── Controllers/Admin/      Hero · Documentation · Feature · Testimonial · Profile · Dashboard
│   ├── Controllers/Auth/       AuthController (login / logout)
│   ├── Controllers/PageController  public home + locale switch
│   └── Middleware/             HandleInertiaRequests · SetLocale
└── Models/                     Hero · Documentation · Feature · Testimonial (HasTranslations)
database/
├── migrations/                 heroes · documentations · features · testimonials (JSON columns)
└── seeders/DatabaseSeeder.php  bilingual fixtures + admin/admin user
resources/
├── css/app.css                 gold theme + cute component classes
├── js/
│   ├── app.tsx                 Inertia + i18n + PWA bootstrap
│   ├── i18n.ts                 react-i18next setup
│   ├── locales/{en,id}.json    UI string catalogs
│   ├── lib/{icons,utils}.ts    icon allowlist + translation picker
│   ├── Components/             Hero · Gallery · WhyHireMe · MarqueeTestimonials · LanguageSwitcher · SeoHead · LazyImage · admin/TranslatableField
│   ├── Layouts/                PublicLayout (top + bottom nav) · AdminLayout
│   └── Pages/                  Public/Home · Auth/Login · Admin/{Dashboard,Hero,Profile,Documentations,Features,Testimonials}
└── views/app.blade.php         Inertia root template (SEO + PWA links)
routes/web.php                  public + locale + auth + admin CRUD
```

## CMS reference

| Section        | Admin route                  | Translatable fields            | Uploads            |
|----------------|------------------------------|--------------------------------|--------------------|
| Hero           | `/admin/hero`                | name, profession, description  | avatar, CV (PDF)   |
| Documentations | `/admin/documentations`      | title, description             | image              |
| Why hire me    | `/admin/features`            | title, description             | —                  |
| Testimonials   | `/admin/testimonials`        | message                        | avatar             |
| Profile        | `/admin/profile`             | (password change only)         | —                  |

The hero record also stores `seo_title_en/id` and `seo_description_en/id` — set them per locale to control the document `<title>` and the `og:`/`twitter:` description per request.

## Localization

- **UI strings:** add the key to `resources/js/locales/en.json` *and* `resources/js/locales/id.json`. The locale switcher saves the choice in the session via `GET /locale/{en|id}`; the React side updates `i18next` synchronously.
- **DB content:** Spatie HasTranslations stores `{en, id}` JSON. Controllers serialize with `getTranslations('field')` and validate per-locale (`description.en`, `description.id`).
- **Fallback:** missing `id` translations fall back to `en`.

## PWA

`npm run build` produces:

- `public/build/sw.js` — service worker (autoUpdate, precaches built assets)
- `public/build/manifest.webmanifest`
- `public/icons/{pwa-192x192,pwa-512x512}.png` (replace with branded artwork before going live)

The SW only registers in production builds; `npm run dev` does not register one. The manifest's `navigateFallbackDenylist` excludes `/admin`, `/login`, and `/storage` so admin actions never run from cache.

## Useful scripts

```bash
npm run dev         # Vite dev server
npm run build       # Vite production build (+ PWA SW)
npm run types       # TypeScript check (tsc --noEmit)
./vendor/bin/pint   # PHP style (--test for check-only)
php artisan test    # PHPUnit 11
```

## License

MIT.
