import type { Locale, Translatable } from '@/types';

export function pickTranslation(
    value: Translatable | undefined | null,
    locale: Locale,
    fallback: Locale = 'en',
): string {
    if (!value) return '';
    return value[locale] || value[fallback] || Object.values(value)[0] || '';
}

export function classNames(...inputs: (string | false | null | undefined)[]): string {
    return inputs.filter(Boolean).join(' ');
}
