import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from '@phosphor-icons/react';
import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import TranslatableField from '@/Components/admin/TranslatableField';
import AdminLayout from '@/Layouts/AdminLayout';
import { resolveIcon } from '@/lib/icons';
import type { Translatable } from '@/types';

interface FeatureData {
    icon: string;
    title: Translatable;
    description: Translatable;
    order: number | '';
}

interface PageProps {
    feature: {
        id: number;
        icon: string;
        title: Translatable;
        description: Translatable;
        order: number;
    } | null;
    icons: string[];
}

export default function FeatureForm() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { t } = useTranslation();
    const editing = props.feature;

    const form = useForm<FeatureData>({
        icon: editing?.icon ?? props.icons[0],
        title: editing?.title ?? { en: '', id: '' },
        description: editing?.description ?? { en: '', id: '' },
        order: editing?.order ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (editing) {
            form.put(route('admin.features.update', editing.id));
        } else {
            form.post(route('admin.features.store'));
        }
    };

    return (
        <AdminLayout title={t('admin.features')}>
            <Link href={route('admin.features.index')} className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-gold-700">
                <ArrowLeft /> {t('admin.back')}
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-stone-800">
                {editing ? t('admin.edit') : t('admin.create')} · {t('admin.features')}
            </h1>

            <form className="mt-6 grid gap-6" onSubmit={submit}>
                <div className="card">
                    <span className="label">{t('admin.icon')}</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {props.icons.map((icon) => {
                            const Icon = resolveIcon(icon);
                            const active = form.data.icon === icon;
                            return (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => form.setData('icon', icon)}
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition ${
                                        active
                                            ? 'bg-gold-500 text-white ring-gold-500'
                                            : 'bg-white text-gold-600 ring-gold-100 hover:bg-gold-50'
                                    }`}
                                    aria-label={icon}
                                    aria-pressed={active}
                                >
                                    <Icon size={22} weight="duotone" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="card grid gap-5">
                    <TranslatableField
                        label={t('admin.title')}
                        value={form.data.title}
                        onChange={(v) => form.setData('title', v)}
                        error={{ en: form.errors['title.en'], id: form.errors['title.id'] }}
                        maxLength={160}
                    />
                    <TranslatableField
                        label={t('admin.description')}
                        type="textarea"
                        value={form.data.description}
                        onChange={(v) => form.setData('description', v)}
                        error={{ en: form.errors['description.en'], id: form.errors['description.id'] }}
                        maxLength={400}
                    />
                </div>

                <div className="card max-w-xs">
                    <span className="label">{t('admin.order')}</span>
                    <input
                        type="number"
                        min={0}
                        className="input mt-1"
                        value={form.data.order}
                        onChange={(e) =>
                            form.setData('order', e.target.value === '' ? '' : Number(e.target.value))
                        }
                    />
                </div>

                <button className="btn-primary self-start" disabled={form.processing}>
                    {t('admin.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
