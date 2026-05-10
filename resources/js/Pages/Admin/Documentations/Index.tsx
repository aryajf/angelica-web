import { Link, router, usePage } from '@inertiajs/react';
import { CalendarBlank, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDateRange, pickTranslation } from '@/lib/utils';
import type { Locale, SharedProps, Translatable } from '@/types';

interface DocumentationRow {
    id: number;
    image_url: string;
    title: Translatable;
    description: Translatable;
    started_at: string | null;
    ended_at: string | null;
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

            <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {props.documentations.map((d) => {
                    const range = formatDateRange(d.started_at, d.ended_at, locale, t('modal.present'));
                    return (
                        <article key={d.id} className="flex h-full flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-soft ring-1 ring-gold-100/60">
                            <img
                                src={d.image_url}
                                alt={pickTranslation(d.title, locale)}
                                loading="lazy"
                                className="h-40 w-full object-cover"
                            />
                            <div className="flex flex-1 flex-col gap-2 p-4">
                                <h3 className="font-semibold text-stone-800">{pickTranslation(d.title, locale)}</h3>
                                {range && (
                                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1 text-[11px] font-semibold text-gold-700 ring-1 ring-gold-100">
                                        <CalendarBlank weight="duotone" size={12} />
                                        {range}
                                    </span>
                                )}
                                <p className="line-clamp-2 text-sm text-stone-500">
                                    {pickTranslation(d.description, locale)}
                                </p>
                                <div className="mt-auto flex items-center justify-end gap-2 pt-2">
                                    <Link
                                        className="btn-ghost"
                                        href={route('admin.documentations.edit', d.id)}
                                    >
                                        <PencilSimple weight="duotone" /> {t('admin.edit')}
                                    </Link>
                                    <button
                                        onClick={() => remove(d.id)}
                                        className="rounded-full p-2 text-rose-500 ring-1 ring-rose-100 hover:bg-rose-50"
                                        aria-label={t('admin.delete')}
                                    >
                                        <Trash weight="duotone" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
