import './bootstrap';
import './i18n';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import i18n from './i18n';
import { registerSW } from 'virtual:pwa-register';

const appName = 'Angelica';

void createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const initial = (props.initialPage?.props ?? {}) as { locale?: string };
        if (initial.locale && i18n.language !== initial.locale) {
            void i18n.changeLanguage(initial.locale);
        }
        if (typeof document !== 'undefined' && initial.locale) {
            document.documentElement.lang = initial.locale;
        }
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#eab308', showSpinner: false },
});

if (import.meta.env.PROD) {
    registerSW({ immediate: true });
}
