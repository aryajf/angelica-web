import { usePage } from '@inertiajs/react';
import {
    ChatTeardropDots,
    HouseSimple,
    type Icon,
    Images,
    Sparkle,
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
        <div className="min-h-screen pb-20 md:pb-0">
            <SeoHead />

            {/* ── Desktop header ── */}
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
                    <LanguageSwitcher />
                </div>
            </header>

            {/* ── Mobile top bar ── */}
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

            {/* ── Mobile bottom nav — icons only, clean & minimal ── */}
            <nav
                aria-label="Primary"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-gold-100/60 bg-white/90 backdrop-blur-2xl md:hidden"
            >
                <ul className="mx-auto flex max-w-sm justify-around px-2 py-2">
                    {navItems.map(({ id, icon: Icon }) => {
                        const isActive = active === id;
                        return (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    onClick={(e) => onNavClick(e, id)}
                                    aria-current={isActive ? 'true' : undefined}
                                    aria-label={id}
                                    className="relative flex h-10 w-10 items-center justify-center rounded-2xl transition"
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobileIndicator"
                                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 shadow-soft"
                                            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                        />
                                    )}
                                    <Icon
                                        size={22}
                                        weight={isActive ? 'fill' : 'regular'}
                                        className={`relative ${isActive ? 'text-gold-700' : 'text-stone-400'}`}
                                    />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
