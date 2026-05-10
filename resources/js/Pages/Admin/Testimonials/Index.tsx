import { Link, router, usePage } from '@inertiajs/react';
import { PencilSimple, Plus, Quotes, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { pickTranslation } from '@/lib/utils';
import type { Locale, SharedProps, Translatable } from '@/types';

interface TestimonialRow {
    id: number;
    client_name: string;
    client_role: string | null;
    avatar_url: string | null;
    message: Translatable;
    order: number;
}

interface PageProps extends SharedProps {
    testimonials: TestimonialRow[];
}

export default function TestimonialsIndex() {
    const { props } = usePage<PageProps>();
    const { t } = useTranslation();
    const locale: Locale = props.locale;

    const remove = (id: number) => {
        if (!confirm(t('admin.deleteConfirm'))) return;
        router.delete(route('admin.testimonials.destroy', id));
    };

    return (
        <AdminLayout title={t('admin.testimonials')}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-stone-800">{t('admin.testimonials')}</h1>
                <Link className="btn-primary" href={route('admin.testimonials.create')}>
                    <Plus weight="bold" /> {t('admin.create')}
                </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                {props.testimonials.map((t0) => (
                    <article key={t0.id} className="card">
                        <Quotes weight="fill" className="text-gold-300" size={22} />
                        <p className="mt-2 text-sm text-stone-600">{pickTranslation(t0.message, locale)}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {t0.avatar_url ? (
                                    <img src={t0.avatar_url} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover ring-1 ring-gold-100" />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-sm font-semibold text-gold-700">
                                        {t0.client_name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-stone-800">{t0.client_name}</p>
                                    {t0.client_role && <p className="text-xs text-stone-500">{t0.client_role}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link className="btn-ghost" href={route('admin.testimonials.edit', t0.id)}>
                                    <PencilSimple weight="duotone" /> {t('admin.edit')}
                                </Link>
                                <button onClick={() => remove(t0.id)} className="rounded-full p-2 text-rose-500 ring-1 ring-rose-100 hover:bg-rose-50" aria-label={t('admin.delete')}>
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
