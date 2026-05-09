import { useTranslation } from 'react-i18next';
import type { Translatable } from '@/types';

type FieldType = 'input' | 'textarea';

interface Props {
    label: string;
    type?: FieldType;
    value: Translatable;
    onChange: (next: Translatable) => void;
    error?: { en?: string; id?: string };
    rows?: number;
    maxLength?: number;
}

export default function TranslatableField({
    label,
    type = 'input',
    value,
    onChange,
    error,
    rows = 3,
    maxLength,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="space-y-2">
            <span className="label">{label}</span>
            <div className="grid gap-3 md:grid-cols-2">
                {(['en', 'id'] as const).map((lang) => (
                    <div key={lang}>
                        <span className="block text-[11px] font-semibold uppercase text-stone-400">
                            {t(`admin.${lang === 'en' ? 'english' : 'indonesian'}`)}
                        </span>
                        {type === 'textarea' ? (
                            <textarea
                                rows={rows}
                                maxLength={maxLength}
                                className="input mt-1"
                                value={value[lang] ?? ''}
                                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                            />
                        ) : (
                            <input
                                type="text"
                                maxLength={maxLength}
                                className="input mt-1"
                                value={value[lang] ?? ''}
                                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                            />
                        )}
                        {error?.[lang] && <p className="mt-1 text-xs text-rose-500">{error[lang]}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
