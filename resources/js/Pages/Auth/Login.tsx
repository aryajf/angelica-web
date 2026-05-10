import { useForm } from '@inertiajs/react';
import { Eye, EyeSlash, Sparkle } from '@phosphor-icons/react';
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import SeoHead from '@/Components/SeoHead';

/* ── Floating particle component ── */
function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) {
    return (
        <div
            className="absolute animate-float rounded-full bg-gold-300/30"
            style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${4 + delay}s`,
            }}
        />
    );
}

export default function Login() {
    const { t } = useTranslation();
    const [showPw, setShowPw] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ name: '', password: '' });

    useEffect(() => { setMounted(true); }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-cream-50 via-white to-gold-50/60 px-4 py-8">
            <SeoHead title={t('auth.title')} description={t('auth.subtitle')} />

            {/* ── Soft background shapes ── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gold-200/40 blur-3xl md:h-[450px] md:w-[450px]" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold-100/50 blur-3xl md:h-[500px] md:w-[500px]" />
                <div className="absolute left-1/3 top-1/2 h-56 w-56 rounded-full bg-cream-200/40 blur-3xl" />
            </div>

            {/* ── Floating particles ── */}
            <div className="pointer-events-none absolute inset-0">
                {[
                    { delay: 0, size: 6, x: 10, y: 20 },
                    { delay: 1.2, size: 8, x: 80, y: 15 },
                    { delay: 0.6, size: 5, x: 25, y: 70 },
                    { delay: 1.8, size: 7, x: 70, y: 60 },
                    { delay: 2.4, size: 4, x: 50, y: 30 },
                    { delay: 0.3, size: 6, x: 90, y: 80 },
                ].map((p, i) => (
                    <FloatingParticle key={i} {...p} />
                ))}
            </div>

            {/* ── Language Switcher ── */}
            <div className="absolute right-3 top-3 z-10 md:right-5 md:top-5">
                <LanguageSwitcher compact />
            </div>

            {/* ── Login Card ── */}
            <div
                className={`relative z-10 w-full max-w-sm transition-all duration-700 md:max-w-md ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
            >
                {/* Logo circle */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 shadow-lg shadow-gold-300/40 ring-4 ring-gold-200/30 transition-transform duration-500 hover:rotate-12 hover:scale-110 md:h-20 md:w-20 md:rounded-3xl">
                    <Sparkle weight="fill" size={28} className="text-white md:hidden" />
                    <Sparkle weight="fill" size={36} className="hidden text-white md:block" />
                </div>

                <div className="rounded-2xl border border-gold-100/80 bg-white/80 px-6 py-8 shadow-xl shadow-gold-100/30 backdrop-blur-lg md:rounded-3xl md:px-10 md:py-10">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="font-display text-xl font-bold text-stone-800 md:text-2xl">
                            {t('auth.title')}
                        </h1>
                        <p className="mt-1 text-xs text-stone-400 md:text-sm">
                            {t('auth.subtitle')}
                        </p>
                    </div>

                    {/* Mimi greeting */}
                    <div className="mx-auto mt-5 flex max-w-xs items-start gap-2.5">
                        <img
                            src="/images/mimi-open.png"
                            alt="Mimi"
                            className="h-10 w-10 shrink-0 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-110 md:h-12 md:w-12"
                        />
                        <div className="rounded-2xl rounded-tl-sm bg-gold-50 px-3.5 py-2 text-xs leading-relaxed text-stone-600 ring-1 ring-gold-100 md:text-sm">
                            Hai! Aku <strong className="text-gold-700">Mimi</strong> 🐱✨
                            Silakan login dulu ya, aku udah siap bantu kamu di dalam!
                        </div>
                    </div>

                    {/* Form */}
                    <form className="mt-6 space-y-4 md:mt-8 md:space-y-5" onSubmit={submit}>
                        {/* Username */}
                        <div className="group">
                            <label
                                className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-stone-400 transition group-focus-within:text-gold-600 md:text-[11px]"
                                htmlFor="name"
                            >
                                {t('auth.username')}
                            </label>
                            <input
                                id="name"
                                type="text"
                                autoFocus
                                autoComplete="username"
                                className="w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-sm text-stone-700 outline-none transition-all duration-300 placeholder:text-stone-300 focus:border-gold-400 focus:bg-white focus:shadow-md focus:shadow-gold-100/40 focus:ring-2 focus:ring-gold-200/50 md:px-4 md:py-3"
                                placeholder={t('auth.username')}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && (
                                <p className="mt-1 text-[11px] font-medium text-rose-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label
                                className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-stone-400 transition group-focus-within:text-gold-600 md:text-[11px]"
                                htmlFor="password"
                            >
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPw ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 pr-11 text-sm text-stone-700 outline-none transition-all duration-300 placeholder:text-stone-300 focus:border-gold-400 focus:bg-white focus:shadow-md focus:shadow-gold-100/40 focus:ring-2 focus:ring-gold-200/50 md:px-4 md:py-3"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 transition hover:text-gold-600"
                                    tabIndex={-1}
                                >
                                    {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-[11px] font-medium text-rose-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-gold-200/50 transition-all duration-300 hover:from-gold-500 hover:to-gold-600 hover:shadow-lg hover:shadow-gold-300/50 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60 disabled:hover:translate-y-0 md:py-3.5"
                        >
                            {processing ? (
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <Sparkle weight="fill" size={14} className="transition-transform duration-300 group-hover:rotate-45 group-hover:scale-125" />
                            )}
                            {t('auth.submit')}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-[10px] font-medium tracking-wide text-stone-300 md:mt-8 md:text-[11px]">
                        <Sparkle weight="fill" size={10} className="mb-0.5 inline text-gold-300" />
                        {' '}Angelica Portfolio{' '}
                        <Sparkle weight="fill" size={10} className="mb-0.5 inline text-gold-300" />
                    </p>
                </div>
            </div>

            {/* ── CSS for float animation ── */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
                    50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
                }
                .animate-float { animation: float 5s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
