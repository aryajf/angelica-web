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

const intlLocale: Record<Locale, string> = { en: 'en-US', id: 'id-ID' };

function formatMonthYear(date: string, locale: Locale): string {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(intlLocale[locale], {
        month: 'short',
        year: 'numeric',
    }).format(d);
}

export function formatDateRange(
    startedAt: string | null | undefined,
    endedAt: string | null | undefined,
    locale: Locale,
    presentLabel: string,
): string {
    if (!startedAt) return '';
    const start = formatMonthYear(startedAt, locale);
    const end = endedAt ? formatMonthYear(endedAt, locale) : presentLabel;
    return `${start} – ${end}`;
}
