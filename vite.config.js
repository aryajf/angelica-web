import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            'ziggy-js': path.resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'Angelica Portfolio',
                short_name: 'Angelica',
                description: 'Personal portfolio with bilingual content management.',
                theme_color: '#eab308',
                background_color: '#fffbeb',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                navigateFallbackDenylist: [/^\/admin/, /^\/login/, /^\/logout/, /^\/storage/],
                globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
            },
            devOptions: { enabled: false },
        }),
    ],
});
