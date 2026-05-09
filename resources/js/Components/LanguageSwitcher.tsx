import { router, usePage } from '@inertiajs/react';
import { Translate } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import type { Locale, SharedProps } from '@/types';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    const { props } = usePage<SharedProps>();
    const { i18n, t } = useTranslation();
    const locales = props.availableLocales;

    const handleSwitch = (locale: Locale) => {
        if (locale === props.locale) return;
        void i18n.changeLanguage(locale);
        router.visit(route('locale.set', { locale }), {
            method: 'get',
            preserveScroll: true,
            preserveState: false,
        });
    };

    if (compact) {
        return (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/80 p-1 ring-1 ring-gold-200">
                {locales.map((l) => (
                    <button
                        key={l}
                        type="button"
                        onClick={() => handleSwitch(l)}
                        aria-pressed={props.locale === l}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                            props.locale === l
                                ? 'bg-gold-500 text-white shadow-soft'
                                : 'text-stone-500 hover:text-gold-700'
                        }`}
                    >
                        {l.toUpperCase()}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <label className="inline-flex items-center gap-2 text-sm">
            <Translate weight="duotone" className="text-gold-500" aria-hidden />
            <span className="sr-only">{t('language.label')}</span>
            <div className="inline-flex items-center gap-1 rounded-full bg-white/80 p-1 ring-1 ring-gold-200">
                {locales.map((l) => (
                    <button
                        key={l}
                        type="button"
                        onClick={() => handleSwitch(l)}
                        aria-pressed={props.locale === l}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            props.locale === l
                                ? 'bg-gold-500 text-white shadow-soft'
                                : 'text-stone-500 hover:text-gold-700'
                        }`}
                    >
                        {l.toUpperCase()}
                    </button>
                ))}
            </div>
        </label>
    );
}
