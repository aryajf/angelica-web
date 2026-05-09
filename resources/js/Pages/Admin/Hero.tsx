import { useForm, usePage } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import TranslatableField from '@/Components/admin/TranslatableField';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Translatable } from '@/types';

interface HeroFormData {
    name: Translatable;
    profession: Translatable;
    description: Translatable;
    email: string;
    instagram_url: string;
    seo_title_en: string;
    seo_title_id: string;
    seo_description_en: string;
    seo_description_id: string;
    avatar: File | null;
    cv: File | null;
    remove_avatar: boolean;
    remove_cv: boolean;
}

interface PageProps {
    hero: {
        avatar_url: string | null;
        cv_url: string | null;
        name: Translatable;
        profession: Translatable;
        description: Translatable;
        email: string | null;
        instagram_url: string | null;
        seo_title_en: string | null;
        seo_title_id: string | null;
        seo_description_en: string | null;
        seo_description_id: string | null;
    };
}

export default function HeroPage() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { t } = useTranslation();
    const hero = props.hero;

    const { data, setData, post, processing, errors, progress } = useForm<HeroFormData>({
        name: hero.name,
        profession: hero.profession,
        description: hero.description,
        email: hero.email ?? '',
        instagram_url: hero.instagram_url ?? '',
        seo_title_en: hero.seo_title_en ?? '',
        seo_title_id: hero.seo_title_id ?? '',
        seo_description_en: hero.seo_description_en ?? '',
        seo_description_id: hero.seo_description_id ?? '',
        avatar: null,
        cv: null,
        remove_avatar: false,
        remove_cv: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.hero.update'), { forceFormData: true });
    };

    return (
        <AdminLayout title={t('admin.hero')}>
            <h1 className="text-2xl font-bold text-stone-800">{t('admin.hero')}</h1>
            <form className="mt-6 grid gap-6" onSubmit={submit}>
                <div className="card grid gap-5">
                    <TranslatableField
                        label={t('admin.name')}
                        value={data.name}
                        onChange={(v) => setData('name', v)}
                        error={{ en: errors['name.en'], id: errors['name.id'] }}
                        maxLength={120}
                    />
                    <TranslatableField
                        label={t('admin.role')}
                        value={data.profession}
                        onChange={(v) => setData('profession', v)}
                        error={{ en: errors['profession.en'], id: errors['profession.id'] }}
                        maxLength={160}
                    />
                    <TranslatableField
                        label={t('admin.description')}
                        type="textarea"
                        value={data.description}
                        onChange={(v) => setData('description', v)}
                        error={{ en: errors['description.en'], id: errors['description.id'] }}
                        maxLength={600}
                    />
                </div>

                <div className="card grid gap-4 md:grid-cols-2">
                    <div>
                        <span className="label">Email</span>
                        <input
                            className="input mt-1"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                    </div>
                    <div>
                        <span className="label">Instagram URL</span>
                        <input
                            className="input mt-1"
                            type="url"
                            value={data.instagram_url}
                            onChange={(e) => setData('instagram_url', e.target.value)}
                        />
                        {errors.instagram_url && <p className="mt-1 text-xs text-rose-500">{errors.instagram_url}</p>}
                    </div>
                </div>

                <div className="card grid gap-4 md:grid-cols-2">
                    <div>
                        <span className="label">{t('admin.uploadAvatar')}</span>
                        {hero.avatar_url && (
                            <div className="mt-2 flex items-center gap-3">
                                <img
                                    src={hero.avatar_url}
                                    alt="avatar"
                                    loading="lazy"
                                    className="h-16 w-16 rounded-2xl object-cover ring-1 ring-gold-100"
                                />
                                <label className="inline-flex items-center gap-2 text-xs text-stone-500">
                                    <input
                                        type="checkbox"
                                        checked={data.remove_avatar}
                                        onChange={(e) => setData('remove_avatar', e.target.checked)}
                                    />
                                    {t('admin.removeAvatar')}
                                </label>
                            </div>
                        )}
                        <input
                            className="mt-2 w-full text-sm text-stone-500"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                        />
                        {errors.avatar && <p className="mt-1 text-xs text-rose-500">{errors.avatar}</p>}
                    </div>
                    <div>
                        <span className="label">{t('admin.uploadCv')}</span>
                        {hero.cv_url && (
                            <div className="mt-2 flex items-center gap-3 text-sm text-stone-500">
                                <a href={hero.cv_url} target="_blank" rel="noopener noreferrer" className="text-gold-700 underline">
                                    {t('admin.currentFile')}
                                </a>
                                <label className="inline-flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={data.remove_cv}
                                        onChange={(e) => setData('remove_cv', e.target.checked)}
                                    />
                                    {t('admin.removeCv')}
                                </label>
                            </div>
                        )}
                        <input
                            className="mt-2 w-full text-sm text-stone-500"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setData('cv', e.target.files?.[0] ?? null)}
                        />
                        {errors.cv && <p className="mt-1 text-xs text-rose-500">{errors.cv}</p>}
                    </div>
                </div>

                <div className="card grid gap-4 md:grid-cols-2">
                    <div>
                        <span className="label">SEO title · EN</span>
                        <input className="input mt-1" value={data.seo_title_en} onChange={(e) => setData('seo_title_en', e.target.value)} />
                    </div>
                    <div>
                        <span className="label">SEO title · ID</span>
                        <input className="input mt-1" value={data.seo_title_id} onChange={(e) => setData('seo_title_id', e.target.value)} />
                    </div>
                    <div>
                        <span className="label">SEO description · EN</span>
                        <textarea className="input mt-1" rows={2} value={data.seo_description_en} onChange={(e) => setData('seo_description_en', e.target.value)} />
                    </div>
                    <div>
                        <span className="label">SEO description · ID</span>
                        <textarea className="input mt-1" rows={2} value={data.seo_description_id} onChange={(e) => setData('seo_description_id', e.target.value)} />
                    </div>
                </div>

                {progress && (
                    <div className="text-xs text-stone-500">{Math.round(progress.percentage ?? 0)}%</div>
                )}

                <button className="btn-primary self-start" disabled={processing}>
                    {t('admin.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
