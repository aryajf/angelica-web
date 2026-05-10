<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#eab308">
    <meta name="description" content="{{ $page['props']['seo']['description'] ?? 'Angelica Portfolio' }}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/icons/pwa-192x192.png">
    <link rel="manifest" href="/build/manifest.webmanifest">

    <title inertia>{{ $page['props']['seo']['title'] ?? config('app.name') }}</title>

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="bg-cream-50 antialiased">
    @inertia
</body>
</html>
