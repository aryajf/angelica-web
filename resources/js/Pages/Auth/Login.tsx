import { useForm } from '@inertiajs/react';
import { Sparkle } from '@phosphor-icons/react';
import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import SeoHead from '@/Components/SeoHead';

export default function Login() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        password: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-100 via-cream-50 to-gold-50 px-4 py-10">
            <SeoHead title={t('auth.title')} description={t('auth.subtitle')} />
            <div className="absolute right-4 top-4">
                <LanguageSwitcher compact />
            </div>
            <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-cute ring-1 ring-gold-100 backdrop-blur">
                <div className="flex items-center gap-2 text-gold-700">
                    <Sparkle weight="fill" />
                    <span className="font-display text-lg font-bold">Angelica</span>
                </div>
                <h1 className="mt-4 text-2xl font-bold text-stone-800">{t('auth.title')}</h1>
                <p className="mt-1 text-sm text-stone-500">{t('auth.subtitle')}</p>

                <form className="mt-6 space-y-4" onSubmit={submit}>
                    <div>
                        <label className="label" htmlFor="name">
                            {t('auth.username')}
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoFocus
                            autoComplete="username"
                            className="input mt-1"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="label" htmlFor="password">
                            {t('auth.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            className="input mt-1"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center" disabled={processing}>
                        {t('auth.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}
