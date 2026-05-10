import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, GoogleDriveLogo, Images, LinkSimple, Play, Plus, Trash, X } from '@phosphor-icons/react';
import { type FormEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TranslatableField from '@/Components/admin/TranslatableField';
import AdminLayout from '@/Layouts/AdminLayout';
import type { MediaItem, Translatable } from '@/types';

interface PageProps {
    documentation: {
        id: number;
        image_url: string;
        image_urls: string[];
        media: MediaItem[];
        title: Translatable;
        description: Translatable;
        started_at: string | null;
        ended_at: string | null;
        order: number;
    } | null;
    errors: Record<string, string>;
}

/**
 * Extract Google Drive file ID from various share link formats.
 * Supports:
 *   - https://drive.google.com/file/d/{ID}/view?usp=sharing
 *   - https://drive.google.com/open?id={ID}
 *   - https://docs.google.com/...?id={ID}
 *   - Raw file ID string (20+ chars)
 */
function extractGdriveFileId(url: string): string | null {
    const trimmed = url.trim();
    // /file/d/{ID}/
    const fileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileD) return fileD[1];
    // ?id={ID} or &id={ID}
    const idParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParam) return idParam[1];
    // Raw ID
    if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
    return null;
}

function isVideoFile(name: string): boolean {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(name);
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

    // Track existing server media
    const [existingMedia, setExistingMedia] = useState<MediaItem[]>(editing?.media ?? []);

    // Accumulated file uploads (ref to avoid stale closures)
    const filesRef = useRef<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{ file: File; url: string; isVideo: boolean }[]>([]);

    // Google Drive links
    const [gdriveLinks, setGdriveLinks] = useState<string[]>([]);
    const [gdriveDraft, setGdriveDraft] = useState('');
    const [gdriveError, setGdriveError] = useState('');

    const addFiles = useCallback((incoming: File[]) => {
        const next = [...filesRef.current, ...incoming];
        filesRef.current = next;

        const newEntries = incoming.map((f) => ({
            file: f,
            url: URL.createObjectURL(f),
            isVideo: isVideoFile(f.name),
        }));
        setFilePreviews((prev) => [...prev, ...newEntries]);
    }, []);

    const removeNewFile = useCallback((index: number) => {
        setFilePreviews((prev) => {
            const copy = [...prev];
            const removed = copy.splice(index, 1);
            removed.forEach((e) => URL.revokeObjectURL(e.url));
            filesRef.current = copy.map((e) => e.file);
            return copy;
        });
    }, []);

    const removeExistingMedia = useCallback((index: number) => {
        setExistingMedia((prev) => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    }, []);

    const addGdriveLink = () => {
        const trimmed = gdriveDraft.trim();
        if (!trimmed) return;

        const fileId = extractGdriveFileId(trimmed);
        if (!fileId) {
            setGdriveError('Invalid Google Drive link. Please use a share link like: https://drive.google.com/file/d/.../view');
            return;
        }

        setGdriveLinks((prev) => [...prev, trimmed]);
        setGdriveDraft('');
        setGdriveError('');
    };

    const removeGdriveLink = (index: number) => {
        setGdriveLinks((prev) => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        addFiles(files);
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
                gdrive_links: gdriveLinks,
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

    const totalMedia = existingMedia.length + filePreviews.length + gdriveLinks.length;
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

                {/* ── Media Upload Section ── */}
                <div className="card grid gap-5">
                    <div className="flex items-center gap-2">
                        <Images weight="duotone" size={18} className="text-gold-600" />
                        <span className="label">Media</span>
                        {totalMedia > 0 && (
                            <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[11px] font-semibold text-gold-700 ring-1 ring-gold-100">
                                {totalMedia} {totalMedia === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>

                    {/* Existing media (when editing) */}
                    {existingMedia.length > 0 && (
                        <div>
                            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-stone-400">
                                Current media
                            </p>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                {existingMedia.map((m, i) => (
                                    <div key={`existing-${i}`} className="group relative">
                                        {m.type === 'video' ? (
                                            <div className="flex h-24 w-full items-center justify-center rounded-xl bg-stone-900 ring-1 ring-gold-100">
                                                <Play weight="fill" size={24} className="text-white/70" />
                                            </div>
                                        ) : m.type === 'gdrive_image' || m.type === 'gdrive_video' ? (
                                            <div className="flex h-24 w-full items-center justify-center rounded-xl bg-stone-100 ring-1 ring-gold-100">
                                                <GoogleDriveLogo weight="duotone" size={24} className="text-stone-400" />
                                            </div>
                                        ) : (
                                            <img
                                                src={m.url}
                                                alt=""
                                                loading="lazy"
                                                className="h-24 w-full rounded-xl object-cover ring-1 ring-gold-100 transition group-hover:ring-rose-200"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeExistingMedia(i)}
                                            className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition hover:bg-rose-600 group-hover:inline-flex"
                                            aria-label={`Remove media ${i + 1}`}
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
                        <div>
                            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-stone-400">
                                New uploads
                            </p>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                {filePreviews.map((entry, i) => (
                                    <div key={`new-${i}`} className="group relative">
                                        {entry.isVideo ? (
                                            <div className="flex h-24 w-full items-center justify-center rounded-xl bg-stone-900 ring-1 ring-emerald-200">
                                                <Play weight="fill" size={24} className="text-white/70" />
                                            </div>
                                        ) : (
                                            <img
                                                src={entry.url}
                                                alt=""
                                                loading="lazy"
                                                className="h-24 w-full rounded-xl object-cover ring-1 ring-emerald-200 transition group-hover:ring-rose-200"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(i)}
                                            className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition hover:bg-rose-600 group-hover:inline-flex"
                                            aria-label={`Remove upload ${i + 1}`}
                                        >
                                            <X size={12} weight="bold" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* File upload button */}
                    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-2.5 text-sm text-stone-500 transition hover:border-gold-400 hover:bg-gold-50/50 hover:text-gold-700">
                        <Plus weight="bold" size={16} />
                        Add images / videos
                        <input
                            ref={fileInputRef}
                            className="hidden"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileChange}
                        />
                    </label>

                    {errors.images && (
                        <p className="text-xs text-rose-500">{errors.images}</p>
                    )}

                    {/* ── Google Drive Link Input ── */}
                    <div className="border-t border-stone-100 pt-4">
                        <div className="flex items-center gap-2">
                            <GoogleDriveLogo weight="duotone" size={18} className="text-blue-500" />
                            <span className="text-sm font-medium text-stone-700">Google Drive Links</span>
                        </div>
                        <p className="mt-1 text-xs text-stone-400">
                            Paste a Google Drive share link to embed images or videos directly.
                        </p>

                        <div className="mt-2 flex gap-2">
                            <div className="relative flex-1">
                                <LinkSimple size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="url"
                                    className="input w-full pl-9"
                                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                                    value={gdriveDraft}
                                    onChange={(e) => {
                                        setGdriveDraft(e.target.value);
                                        setGdriveError('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addGdriveLink();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addGdriveLink}
                                className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200 transition hover:bg-blue-100"
                            >
                                Add
                            </button>
                        </div>

                        {gdriveError && (
                            <p className="mt-1 text-xs text-rose-500">{gdriveError}</p>
                        )}
                        {errors['gdrive_links'] && (
                            <p className="mt-1 text-xs text-rose-500">{errors['gdrive_links']}</p>
                        )}

                        {/* Added GDrive links list */}
                        {gdriveLinks.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                {gdriveLinks.map((link, i) => {
                                    const fileId = extractGdriveFileId(link);
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 rounded-lg bg-blue-50/60 px-3 py-2 text-xs ring-1 ring-blue-100"
                                        >
                                            <GoogleDriveLogo weight="duotone" size={14} className="shrink-0 text-blue-500" />
                                            <span className="min-w-0 flex-1 truncate text-stone-600">{link}</span>
                                            {fileId && (
                                                <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-mono text-blue-600">
                                                    {fileId.slice(0, 12)}…
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeGdriveLink(i)}
                                                className="shrink-0 rounded-full p-0.5 text-rose-500 transition hover:bg-rose-100"
                                                aria-label={`Remove link ${i + 1}`}
                                            >
                                                <Trash size={14} weight="bold" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order */}
                <div className="card">
                    <span className="label">{t('admin.order')}</span>
                    <input
                        type="number"
                        min={0}
                        className="input mt-1 w-40"
                        value={order}
                        onChange={(e) =>
                            setOrder(e.target.value === '' ? '' : Number(e.target.value))
                        }
                    />
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
