import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Images, Plus, X } from '@phosphor-icons/react';
import { type FormEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TranslatableField from '@/Components/admin/TranslatableField';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Translatable } from '@/types';

interface PageProps {
    documentation: {
        id: number;
        image_url: string;
        image_urls: string[];
        title: Translatable;
        description: Translatable;
        started_at: string | null;
        ended_at: string | null;
        order: number;
    } | null;
    errors: Record<string, string>;
}

export default function DocumentationForm() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { t } = useTranslation();
    const editing = props.documentation;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState<Translatable>(editing?.title ?? { en: '', id: '' });
    const [description, setDescription] = useState<Translatable>(editing?.description ?? { en: '', id: '' });
    const [startedAt, setStartedAt] = useState(editing?.started_at ?? '');
    const [endedAt, setEndedAt] = useState(editing?.ended_at ?? '');
    const [order, setOrder] = useState<number | ''>(editing?.order ?? '');
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);

    // Track existing server images separately from newly picked files
    const [existingImages, setExistingImages] = useState<string[]>(editing?.image_urls ?? []);

    // Use a ref for accumulated files so closures always see the latest value
    const filesRef = useRef<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{ file: File; url: string }[]>([]);

    const addFiles = useCallback((incoming: File[]) => {
        const next = [...filesRef.current, ...incoming];
        filesRef.current = next;

        const newEntries = incoming.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
        setFilePreviews((prev) => [...prev, ...newEntries]);
    }, []);

    const removeNewFile = useCallback((index: number) => {
        // Revoke blob URL
        setFilePreviews((prev) => {
            const copy = [...prev];
            const removed = copy.splice(index, 1);
            removed.forEach((e) => URL.revokeObjectURL(e.url));
            // Sync ref
            filesRef.current = copy.map((e) => e.file);
            return copy;
        });
    }, []);

    const removeExistingImage = useCallback((index: number) => {
        setExistingImages((prev) => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        addFiles(files);

        // Reset input so user can pick the same file again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        const url = editing
            ? route('admin.documentations.update', editing.id)
            : route('admin.documentations.store');

        setProcessing(true);
        router.post(
            url,
            {
                _method: editing ? 'put' : 'post',
                title,
                description,
                started_at: startedAt,
                ended_at: endedAt,
                order: order === '' ? null : order,
                images: filesRef.current,
            },
            {
                forceFormData: true,
                onProgress: (p) => setProgress(p?.percentage ?? null),
                onFinish: () => {
                    setProcessing(false);
                    setProgress(null);
                },
            },
        );
    };

    const totalImages = existingImages.length + filePreviews.length;
    const errors = (props.errors ?? {}) as Record<string, string>;

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
                        value={title}
                        onChange={setTitle}
                        error={{ en: errors['title.en'], id: errors['title.id'] }}
                        maxLength={160}
                    />
                    <TranslatableField
                        label={t('admin.description')}
                        type="textarea"
                        value={description}
                        onChange={setDescription}
                        error={{ en: errors['description.en'], id: errors['description.id'] }}
                        maxLength={600}
                    />
                </div>

                <div className="card grid gap-4 md:grid-cols-2">
                    <div>
                        <span className="label">{t('modal.startDate')}</span>
                        <input
                            type="date"
                            className="input mt-1"
                            value={startedAt}
                            onChange={(e) => setStartedAt(e.target.value)}
                        />
                        {errors.started_at && (
                            <p className="mt-1 text-xs text-rose-500">{errors.started_at}</p>
                        )}
                    </div>
                    <div>
                        <span className="label">{t('modal.endDate')}</span>
                        <input
                            type="date"
                            className="input mt-1"
                            value={endedAt}
                            onChange={(e) => setEndedAt(e.target.value)}
                        />
                        <p className="mt-1 text-xs text-stone-400">{t('modal.endDateHint')}</p>
                        {errors.ended_at && (
                            <p className="mt-1 text-xs text-rose-500">{errors.ended_at}</p>
                        )}
                    </div>
                </div>

                <div className="card grid gap-4 md:grid-cols-[1fr,160px]">
                    <div>
                        <div className="flex items-center gap-2">
                            <Images weight="duotone" size={18} className="text-gold-600" />
                            <span className="label">{t('admin.uploadImage')}</span>
                            {totalImages > 0 && (
                                <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[11px] font-semibold text-gold-700 ring-1 ring-gold-100">
                                    {totalImages} {totalImages === 1 ? 'image' : 'images'}
                                </span>
                            )}
                        </div>

                        {/* Existing server images (only when editing) */}
                        {existingImages.length > 0 && (
                            <div className="mt-3">
                                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-stone-400">
                                    Current images
                                </p>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                    {existingImages.map((url, i) => (
                                        <div key={`existing-${i}`} className="group relative">
                                            <img
                                                src={url}
                                                alt=""
                                                loading="lazy"
                                                className="h-24 w-full rounded-xl object-cover ring-1 ring-gold-100 transition group-hover:ring-rose-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(i)}
                                                className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition hover:bg-rose-600 group-hover:inline-flex"
                                                aria-label={`Remove existing image ${i + 1}`}
                                            >
                                                <X size={12} weight="bold" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New file previews */}
                        {filePreviews.length > 0 && (
                            <div className="mt-3">
                                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-stone-400">
                                    New uploads
                                </p>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                    {filePreviews.map((entry, i) => (
                                        <div key={`new-${i}`} className="group relative">
                                            <img
                                                src={entry.url}
                                                alt=""
                                                loading="lazy"
                                                className="h-24 w-full rounded-xl object-cover ring-1 ring-emerald-200 transition group-hover:ring-rose-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewFile(i)}
                                                className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition hover:bg-rose-600 group-hover:inline-flex"
                                                aria-label={`Remove new image ${i + 1}`}
                                            >
                                                <X size={12} weight="bold" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-2.5 text-sm text-stone-500 transition hover:border-gold-400 hover:bg-gold-50/50 hover:text-gold-700">
                            <Plus weight="bold" size={16} />
                            Add images
                            <input
                                ref={fileInputRef}
                                className="hidden"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </label>

                        {errors.images && (
                            <p className="mt-1 text-xs text-rose-500">{errors.images}</p>
                        )}
                    </div>
                    <div>
                        <span className="label">{t('admin.order')}</span>
                        <input
                            type="number"
                            min={0}
                            className="input mt-1"
                            value={order}
                            onChange={(e) =>
                                setOrder(e.target.value === '' ? '' : Number(e.target.value))
                            }
                        />
                    </div>
                </div>

                {progress !== null && (
                    <div className="text-xs text-stone-500">{Math.round(progress)}%</div>
                )}

                <button className="btn-primary self-start" disabled={processing}>
                    {t('admin.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
