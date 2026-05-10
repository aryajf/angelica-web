import { Link, router, usePage } from '@inertiajs/react';
import {
    ChatTeardropDots,
    Gauge,
    Images,
    SignOut,
    Sparkle,
    User,
    UserCircle,
} from '@phosphor-icons/react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import SeoHead from '@/Components/SeoHead';
import MimiAssistant from '@/Components/admin/MimiAssistant';
import type { SharedProps } from '@/types';

export default function AdminLayout({
    children,
    title,
}: PropsWithChildren<{ title?: string }>) {
    const { t } = useTranslation();
    const { props, url } = usePage<SharedProps>();
    const flash = props.flash;

    const navItems = [
        { name: t('admin.dashboard'), href: route('admin.dashboard'), icon: Gauge, match: '/admin' },
        { name: t('admin.hero'), href: route('admin.hero.edit'), icon: User, match: '/admin/hero' },
        { name: t('admin.documentations'), href: route('admin.documentations.index'), icon: Images, match: '/admin/documentations' },
        { name: t('admin.features'), href: route('admin.features.index'), icon: Sparkle, match: '/admin/features' },
        { name: t('admin.testimonials'), href: route('admin.testimonials.index'), icon: ChatTeardropDots, match: '/admin/testimonials' },
        { name: t('admin.profile'), href: route('admin.profile.edit'), icon: UserCircle, match: '/admin/profile' },
    ];

    const isActive = (match: string) =>
        match === '/admin' ? url === '/admin' : url.startsWith(match);

    const logout = () => router.post(route('logout'));

    return (
        <div className="min-h-screen bg-cream-50">
            <SeoHead title={title ? `${title} · Admin` : 'Admin'} />
            <div className="mx-auto flex gap-6 px-4 py-6 md:px-6">
                <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-gold-100 md:flex">
                    <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-gold-700">
                        <Sparkle weight="fill" /> Angelica
                    </Link>
                    <nav className="mt-6 flex flex-1 flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                                    isActive(item.match)
                                        ? 'bg-gold-50 text-gold-700'
                                        : 'text-stone-500 hover:bg-gold-50 hover:text-gold-700'
                                }`}
                            >
                                <item.icon weight="duotone" size={18} /> {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto flex flex-col gap-3">
                        <LanguageSwitcher compact />
                        <button onClick={logout} className="btn-ghost justify-center">
                            <SignOut weight="duotone" /> {t('admin.logout')}
                        </button>
                    </div>
                </aside>

                <main className="flex-1 pb-24 md:pb-0">
                    <header className="mb-4 flex items-center justify-between md:hidden">
                        <Link href="/" className="flex items-center gap-2 font-display text-base font-bold text-gold-700">
                            <Sparkle weight="fill" /> Angelica
                        </Link>
                        <div className="flex items-center gap-2">
                            <LanguageSwitcher compact />
                            <button onClick={logout} aria-label={t('admin.logout')} className="rounded-full bg-white p-2 ring-1 ring-gold-100">
                                <SignOut weight="duotone" />
                            </button>
                        </div>
                    </header>

                    {flash.success && (
                        <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
                            {flash.error}
                        </div>
                    )}

                    {children}
                </main>
            </div>

            <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-sm rounded-t-3xl border-t border-gold-100 bg-white/95 px-1 py-1.5 shadow-cute backdrop-blur md:hidden">
                <ul className="grid grid-cols-6">
                    {navItems.map((item) => (
                        <li key={item.href} className="flex">
                            <Link
                                href={item.href}
                                className={`flex w-full flex-col items-center justify-center rounded-2xl py-2 transition ${
                                    isActive(item.match)
                                        ? 'text-gold-700'
                                        : 'text-stone-400 hover:text-gold-600'
                                }`}
                            >
                                <item.icon size={22} weight={isActive(item.match) ? 'fill' : 'duotone'} />
                                {isActive(item.match) && (
                                    <span className="mt-1 h-1 w-1 rounded-full bg-gold-500" />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <MimiAssistant />
        </div>
    );
}
