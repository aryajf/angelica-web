import { Link, router, usePage } from '@inertiajs/react';
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { pickTranslation } from '@/lib/utils';
import type { Locale, SharedProps, Translatable } from '@/types';

interface DocumentationRow {
    id: number;
    image_url: string;
    title: Translatable;
    description: Translatable;
    order: number;
}

interface PageProps extends SharedProps {
    documentations: DocumentationRow[];
}

export default function DocumentationsIndex() {
    const { props } = usePage<PageProps>();
    const { t } = useTranslation();
    const locale: Locale = props.locale;

    const remove = (id: number) => {
        if (!confirm(t('admin.deleteConfirm'))) return;
        router.delete(route('admin.documentations.destroy', id));
    };

    return (
        <AdminLayout title={t('admin.documentations')}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-stone-800">{t('admin.documentations')}</h1>
                <Link className="btn-primary" href={route('admin.documentations.create')}>
                    <Plus weight="bold" /> {t('admin.create')}
                </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {props.documentations.map((d) => (
                    <article key={d.id} className="card overflow-hidden p-0">
                        <img
                            src={d.image_url}
                            alt={pickTranslation(d.title, locale)}
                            loading="lazy"
                            className="h-40 w-full object-cover"
                        />
                        <div className="space-y-2 p-4">
                            <h3 className="font-semibold text-stone-800">{pickTranslation(d.title, locale)}</h3>
                            <p className="line-clamp-2 text-sm text-stone-500">
                                {pickTranslation(d.description, locale)}
                            </p>
                            <div className="flex items-center justify-end gap-2">
                                <Link
                                    className="btn-ghost"
                                    href={route('admin.documentations.edit', d.id)}
                                >
                                    <PencilSimple weight="duotone" /> {t('admin.edit')}
                                </Link>
                                <button onClick={() => remove(d.id)} className="rounded-full p-2 text-rose-500 ring-1 ring-rose-100 hover:bg-rose-50" aria-label={t('admin.delete')}>
                                    <Trash weight="duotone" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </AdminLayout>
    );
}
