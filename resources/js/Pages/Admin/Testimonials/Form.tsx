import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from '@phosphor-icons/react';
import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import TranslatableField from '@/Components/admin/TranslatableField';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Translatable } from '@/types';

interface TestimonialData {
    client_name: string;
    client_role: string;
    message: Translatable;
    order: number | '';
    avatar: File | null;
    remove_avatar: boolean;
    _method: 'post' | 'put';
}

interface PageProps {
    testimonial: {
        id: number;
        client_name: string;
        client_role: string | null;
        avatar_url: string | null;
        message: Translatable;
        order: number;
    } | null;
}

export default function TestimonialForm() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { t } = useTranslation();
    const editing = props.testimonial;

    const form = useForm<TestimonialData>({
        client_name: editing?.client_name ?? '',
        client_role: editing?.client_role ?? '',
        message: editing?.message ?? { en: '', id: '' },
        order: editing?.order ?? '',
        avatar: null,
        remove_avatar: false,
        _method: editing ? 'put' : 'post',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const url = editing
            ? route('admin.testimonials.update', editing.id)
            : route('admin.testimonials.store');
        form.post(url, { forceFormData: true });
    };

    return (
        <AdminLayout title={t('admin.testimonials')}>
            <Link href={route('admin.testimonials.index')} className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-gold-700">
                <ArrowLeft /> {t('admin.back')}
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-stone-800">
                {editing ? t('admin.edit') : t('admin.create')} · {t('admin.testimonials')}
            </h1>

            <form className="mt-6 grid gap-6" onSubmit={submit}>
                <div className="card grid gap-4 md:grid-cols-2">
                    <div>
                        <span className="label">{t('admin.name')}</span>
                        <input
                            className="input mt-1"
                            value={form.data.client_name}
                            onChange={(e) => form.setData('client_name', e.target.value)}
                        />
                        {form.errors.client_name && <p className="mt-1 text-xs text-rose-500">{form.errors.client_name}</p>}
                    </div>
                    <div>
                        <span className="label">{t('admin.role')}</span>
                        <input
                            className="input mt-1"
                            value={form.data.client_role}
                            onChange={(e) => form.setData('client_role', e.target.value)}
                        />
                    </div>
                </div>

                <div className="card">
                    <TranslatableField
                        label={t('admin.message')}
                        type="textarea"
                        value={form.data.message}
                        onChange={(v) => form.setData('message', v)}
                        error={{ en: form.errors['message.en'], id: form.errors['message.id'] }}
                        maxLength={600}
                    />
                </div>

                <div className="card grid gap-4 md:grid-cols-[1fr,160px]">
                    <div>
                        <span className="label">{t('admin.uploadAvatar')}</span>
                        {editing?.avatar_url && (
                            <div className="mt-2 flex items-center gap-3">
                                <img
                                    src={editing.avatar_url}
                                    alt=""
                                    loading="lazy"
                                    className="h-14 w-14 rounded-full object-cover ring-1 ring-gold-100"
                                />
                                <label className="inline-flex items-center gap-2 text-xs text-stone-500">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remove_avatar}
                                        onChange={(e) => form.setData('remove_avatar', e.target.checked)}
                                    />
                                    {t('admin.removeAvatar')}
                                </label>
                            </div>
                        )}
                        <input
                            className="mt-2 w-full text-sm text-stone-500"
                            type="file"
                            accept="image/*"
                            onChange={(e) => form.setData('avatar', e.target.files?.[0] ?? null)}
                        />
                    </div>
                    <div>
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
                </div>

                {form.progress && <div className="text-xs text-stone-500">{Math.round(form.progress.percentage ?? 0)}%</div>}

                <button className="btn-primary self-start" disabled={form.processing}>
                    {t('admin.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
