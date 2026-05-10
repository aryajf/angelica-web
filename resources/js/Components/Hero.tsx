import {
    EnvelopeSimple,
    FilePdf,
    InstagramLogo,
    Sparkle,
    Star,
} from '@phosphor-icons/react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'framer-motion';
import { type MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LazyImage from '@/Components/LazyImage';
import { pickTranslation } from '@/lib/utils';
import type { Hero as HeroType, Locale } from '@/types';

export default function Hero({ hero, locale }: { hero: HeroType; locale: Locale }) {
    const { t } = useTranslation();
    const reduce = useReducedMotion();

    const name = pickTranslation(hero.name, locale);
    const profession = pickTranslation(hero.profession, locale);
    const description = pickTranslation(hero.description, locale);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 });
    const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 });
    const rotateY = useTransform(sx, [-1, 1], [-12, 12]);
    const rotateX = useTransform(sy, [-1, 1], [10, -10]);
    const translateZ = useTransform(sx, [-1, 1], [0, 0]);

    useEffect(() => {
        if (!reduce) return;
        mx.set(0);
        my.set(0);
    }, [reduce, mx, my]);

    const handleMove = (e: MouseEvent<HTMLDivElement>) => {
        if (reduce) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mx.set(x * 2);
        my.set(y * 2);
    };

    const handleLeave = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <section id="home" className="relative overflow-hidden pb-20">
            {/* animated mesh / glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-gold-300 via-gold-200 to-cream-100 opacity-70 blur-3xl animate-blob" />
                <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-cream-200 to-gold-100 opacity-80 blur-3xl animate-blob [animation-delay:-4s]" />
                <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-gradient-to-bl from-gold-200/60 to-transparent blur-3xl animate-blob [animation-delay:-8s]" />
            </div>

            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-[auto,1fr] md:py-24">
                {/* avatar with 3D parallax */}
                <motion.div
                    className="relative mx-auto md:mx-0 tilt-3d"
                    style={{ rotateX, rotateY, translateZ }}
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
                >
                    {/* rotating ring */}
                    <div
                        className="absolute -inset-6 rounded-full bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 opacity-40 blur-2xl animate-spin-slow"
                        style={{ transform: 'translateZ(-40px)' }}
                        aria-hidden
                    />
                    {/* dotted halo */}
                    <svg
                        className="absolute -inset-4 animate-spin-slow text-gold-300/70"
                        style={{ transform: 'translateZ(-20px)' }}
                        viewBox="0 0 200 200"
                        aria-hidden
                    >
                        <circle
                            cx="100"
                            cy="100"
                            r="92"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="2 8"
                        />
                    </svg>

                    <motion.div
                        className="relative overflow-hidden rounded-[36%_64%_55%_45%/50%_60%_40%_50%] ring-4 ring-white shadow-cute"
                        style={{ transform: 'translateZ(60px)' }}
                        animate={reduce ? undefined : { borderRadius: ['36% 64% 55% 45% / 50% 60% 40% 50%', '64% 36% 40% 60% / 30% 70% 30% 70%', '36% 64% 55% 45% / 50% 60% 40% 50%'] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {hero.avatar_url ? (
                            <LazyImage
                                src={hero.avatar_url}
                                alt={name}
                                className="h-48 w-48 object-cover md:h-60 md:w-60"
                            />
                        ) : (
                            <div className="flex h-48 w-48 items-center justify-center bg-gradient-to-br from-gold-200 to-cream-100 text-6xl text-gold-700 md:h-60 md:w-60">
                                <Sparkle weight="duotone" />
                            </div>
                        )}
                    </motion.div>

                    {/* floating badges */}
                    <motion.div
                        className="absolute -top-3 -right-2 rounded-2xl bg-white/90 p-2 shadow-cute ring-1 ring-gold-100 backdrop-blur"
                        style={{ transform: 'translateZ(80px)' }}
                        animate={reduce ? undefined : { y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Star weight="fill" className="text-gold-400" size={20} />
                    </motion.div>
                </motion.div>

                {/* copy */}
                <div className="text-center md:text-left">
                    <motion.span
                        className="pill"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <Sparkle weight="fill" /> Hello, {locale === 'id' ? 'aku' : "I'm"}
                    </motion.span>

                    <motion.h1
                        className="mt-3 text-4xl font-bold leading-tight md:text-6xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                    >
                        <span className="text-shimmer">{name}</span>
                    </motion.h1>

                    <motion.p
                        className="mt-2 text-lg font-medium text-gold-700 md:text-xl"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.55 }}
                    >
                        {profession}
                    </motion.p>

                    <motion.p
                        className="mt-4 max-w-xl text-base leading-relaxed text-stone-600"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.38, duration: 0.55 }}
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.55 }}
                    >
                        {hero.email && (
                            <a className="btn-primary" href={`mailto:${hero.email}`}>
                                <EnvelopeSimple weight="duotone" /> {t('hero.emailMe')}
                            </a>
                        )}
                        {hero.instagram_url && (
                            <a
                                className="btn-ghost"
                                href={hero.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InstagramLogo weight="duotone" /> {t('hero.instagram')}
                            </a>
                        )}
                        {hero.cv_url ? (
                            <a className="btn-ghost" href={hero.cv_url} target="_blank" rel="noopener noreferrer">
                                <FilePdf weight="duotone" /> {t('hero.downloadCv')}
                            </a>
                        ) : (
                            <span className="pill" title={t('hero.cvUnavailable')}>
                                <FilePdf weight="duotone" /> {t('hero.cvUnavailable')}
                            </span>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* floating decorative shapes */}
            <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
                <div className="absolute left-[8%] top-[20%] h-3 w-3 rounded-full bg-gold-400/70 animate-float-slow" />
                <div className="absolute right-[14%] top-[35%] h-4 w-4 rotate-45 rounded-md bg-gold-300/70 animate-float-slower" />
                <div className="absolute left-[20%] bottom-[12%] h-2.5 w-2.5 rounded-full bg-gold-500/60 animate-float-slower" />
                <Sparkle
                    weight="fill"
                    className="absolute right-[8%] bottom-[20%] text-gold-300/80 animate-float-slow"
                    size={28}
                />
            </div>
        </section>
    );
}
