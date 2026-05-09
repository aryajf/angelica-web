import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from '@phosphor-icons/react';
import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import TranslatableField from '@/Components/admin/TranslatableField';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Translatable } from '@/types';

interface DocumentationData {
    title: Translatable;
    description: Translatable;
    order: number | '';
    image: File | null;
    _method: 'post' | 'put';
}

interface PageProps {
    documentation: {
        id: number;
        image_url: string;
        title: Translatable;
        description: Translatable;
        order: number;
    } | null;
}

export default function DocumentationForm() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { t } = useTranslation();
    const editing = props.documentation;

    const form = useForm<DocumentationData>({
        title: editing?.title ?? { en: '', id: '' },
        description: editing?.description ?? { en: '', id: '' },
        order: editing?.order ?? '',
        image: null,
        _method: editing ? 'put' : 'post',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const url = editing
            ? route('admin.documentations.update', editing.id)
            : route('admin.documentations.store');
        form.post(url, { forceFormData: true });
    };

    return (
        <AdminLayout title={t('admin.documentations')}>
            <Link
                href={route('admin.documentations.index')}
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-gold-700"
            >
                <ArrowLeft /> {t('admin.back')}
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-stone-800">
                {editing ? t('admin.edit') : t('admin.create')} · {t('admin.documentations')}
            </h1>

            <form className="mt-6 grid gap-6" onSubmit={submit}>
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
                        maxLength={600}
                    />
                </div>

                <div className="card grid gap-4 md:grid-cols-[1fr,160px]">
                    <div>
                        <span className="label">{t('admin.uploadImage')}</span>
                        {editing && (
                            <img
                                src={editing.image_url}
                                alt=""
                                loading="lazy"
                                className="mt-2 h-32 w-32 rounded-2xl object-cover ring-1 ring-gold-100"
                            />
                        )}
                        <input
                            className="mt-2 w-full text-sm text-stone-500"
                            type="file"
                            accept="image/*"
                            onChange={(e) => form.setData('image', e.target.files?.[0] ?? null)}
                        />
                        {form.errors.image && (
                            <p className="mt-1 text-xs text-rose-500">{form.errors.image}</p>
                        )}
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

                {form.progress && (
                    <div className="text-xs text-stone-500">{Math.round(form.progress.percentage ?? 0)}%</div>
                )}

                <button className="btn-primary self-start" disabled={form.processing}>
                    {t('admin.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
