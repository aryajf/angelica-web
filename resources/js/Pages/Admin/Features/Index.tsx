import { Link, router, usePage } from '@inertiajs/react';
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { resolveIcon } from '@/lib/icons';
import { pickTranslation } from '@/lib/utils';
import type { Locale, SharedProps, Translatable } from '@/types';

interface FeatureRow {
    id: number;
    icon: string;
    title: Translatable;
    description: Translatable;
    order: number;
}

interface PageProps extends SharedProps {
    features: FeatureRow[];
    icons: string[];
}

export default function FeaturesIndex() {
    const { props } = usePage<PageProps>();
    const { t } = useTranslation();
    const locale: Locale = props.locale;

    const remove = (id: number) => {
        if (!confirm(t('admin.deleteConfirm'))) return;
        router.delete(route('admin.features.destroy', id));
    };

    return (
        <AdminLayout title={t('admin.features')}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-stone-800">{t('admin.features')}</h1>
                <Link className="btn-primary" href={route('admin.features.create')}>
                    <Plus weight="bold" /> {t('admin.create')}
                </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {props.features.map((f) => {
                    const Icon = resolveIcon(f.icon);
                    return (
                        <article key={f.id} className="card">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-50 ring-1 ring-gold-100">
                                <Icon size={22} weight="duotone" className="text-gold-600" />
                            </div>
                            <h3 className="mt-3 font-semibold text-stone-800">{pickTranslation(f.title, locale)}</h3>
                            <p className="mt-1 text-sm text-stone-500">{pickTranslation(f.description, locale)}</p>
                            <div className="mt-4 flex items-center justify-end gap-2">
                                <Link className="btn-ghost" href={route('admin.features.edit', f.id)}>
                                    <PencilSimple weight="duotone" /> {t('admin.edit')}
                                </Link>
                                <button onClick={() => remove(f.id)} className="rounded-full p-2 text-rose-500 ring-1 ring-rose-100 hover:bg-rose-50" aria-label={t('admin.delete')}>
                                    <Trash weight="duotone" />
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
