import { Link, usePage } from '@inertiajs/react';
import {
    ChatTeardropDots,
    HouseSimple,
    type Icon,
    Images,
    SignIn,
    Sparkle,
    User,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { type MouseEvent, type PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import SeoHead from '@/Components/SeoHead';
import { useActiveSection } from '@/lib/useActiveSection';
import type { SharedProps } from '@/types';

interface NavItem {
    id: string;
    label: string;
    icon: Icon;
}

export default function PublicLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    const { props } = usePage<SharedProps>();
    const isAuthed = !!props.auth.user;

    const navItems: NavItem[] = useMemo(
        () => [
            { id: 'home', label: t('nav.home'), icon: HouseSimple },
            { id: 'work', label: t('nav.work'), icon: Images },
            { id: 'about', label: t('nav.about'), icon: Sparkle },
            { id: 'testimonials', label: t('nav.testimonials'), icon: ChatTeardropDots },
        ],
        [t],
    );

    const ids = useMemo(() => navItems.map((n) => n.id), [navItems]);
    const [active, setActive] = useActiveSection(ids, 96);

    const onNavClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        setActive(id);
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', `#${id}`);
    };

    return (
        <div className="min-h-screen pb-24 md:pb-0">
            <SeoHead />

            <header className="sticky top-0 z-40 hidden border-b border-gold-100/40 bg-cream-50/70 backdrop-blur-xl md:block">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <a
                        href="#home"
                        onClick={(e) => onNavClick(e, 'home')}
                        className="group flex items-center gap-2 font-display text-lg font-bold"
                    >
                        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-white shadow-cute transition-transform group-hover:rotate-12">
                            <Sparkle weight="fill" />
                        </span>
                        <span className="text-shimmer">Angelica</span>
                    </a>
                    <nav className="relative flex items-center gap-1 rounded-full bg-white/60 p-1 ring-1 ring-gold-100 backdrop-blur">
                        {navItems.map(({ id, label }) => {
                            const isActive = active === id;
                            return (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    onClick={(e) => onNavClick(e, id)}
                                    aria-current={isActive ? 'true' : undefined}
                                    className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                        isActive ? 'text-gold-800' : 'text-stone-500 hover:text-gold-700'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="navIndicator"
                                            className="absolute inset-0 -z-0 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 shadow-soft ring-1 ring-gold-200"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative">{label}</span>
                                </a>
                            );
                        })}
                    </nav>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        {isAuthed ? (
                            <Link href={route('admin.dashboard')} className="btn-ghost">
                                <User weight="duotone" /> {t('nav.admin')}
                            </Link>
                        ) : (
                            <Link href={route('login')} className="btn-ghost">
                                <SignIn weight="duotone" /> {t('nav.login')}
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gold-100/40 bg-cream-50/80 px-5 py-3 backdrop-blur-xl md:hidden">
                <a
                    href="#home"
                    onClick={(e) => onNavClick(e, 'home')}
                    className="flex items-center gap-2 font-display text-base font-bold text-gold-700"
                >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-white shadow-soft">
                        <Sparkle weight="fill" />
                    </span>
                    <span className="text-shimmer">Angelica</span>
                </a>
                <LanguageSwitcher compact />
            </header>

            <main>{children}</main>

            <footer className="border-t border-gold-100/40 bg-white/40 py-10 text-center text-sm text-stone-500 backdrop-blur">
                <p className="font-medium">© {new Date().getFullYear()} Angelica · {t('footer.rights')}</p>
                <p className="mt-1 text-xs">{t('footer.madeWith')}</p>
            </footer>

            <nav
                aria-label="Primary"
                className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-3xl border border-gold-100 bg-white/80 px-2 py-1.5 shadow-cute backdrop-blur-2xl md:hidden"
            >
                <ul className="relative grid grid-cols-5">
                    {navItems.map(({ id, label, icon: Icon }) => {
                        const isActive = active === id;
                        return (
                            <li key={id} className="flex">
                                <a
                                    href={`#${id}`}
                                    onClick={(e) => onNavClick(e, id)}
                                    aria-current={isActive ? 'true' : undefined}
                                    className="relative flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-semibold transition"
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobileIndicator"
                                            className="absolute inset-1 -z-0 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 shadow-soft"
                                            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                        />
                                    )}
                                    <span className={`relative ${isActive ? 'text-gold-800' : 'text-stone-500'}`}>
                                        <Icon size={22} weight={isActive ? 'fill' : 'duotone'} />
                                    </span>
                                    <span className={`relative ${isActive ? 'text-gold-800' : 'text-stone-500'}`}>
                                        {label}
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                    <li className="flex">
                        <Link
                            href={isAuthed ? route('admin.dashboard') : route('login')}
                            className="flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-semibold text-stone-500 transition hover:text-gold-700"
                        >
                            {isAuthed ? <User size={22} weight="duotone" /> : <SignIn size={22} weight="duotone" />}
                            {isAuthed ? t('nav.admin') : t('nav.login')}
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
