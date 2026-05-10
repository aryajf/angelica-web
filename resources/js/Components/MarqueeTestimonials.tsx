import { Quotes, Star } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Reveal from '@/Components/Reveal';
import { pickTranslation } from '@/lib/utils';
import type { Locale, Testimonial } from '@/types';

export default function MarqueeTestimonials({
    testimonials,
    locale,
}: {
    testimonials: Testimonial[];
    locale: Locale;
}) {
    const { t } = useTranslation();
    const reduce = useReducedMotion();
    if (testimonials.length === 0) return null;

    const loop = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    return (
        <section id="testimonials" className="relative pb-40">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-transparent via-gold-50/50 to-transparent"
                aria-hidden
            />

            <Reveal className="mx-auto max-w-3xl px-6 text-center">
                <span className="pill">{t('sections.testimonials.eyebrow')}</span>
                <h2 className="mt-3 text-3xl font-bold md:text-5xl">
                    <span className="text-shimmer">{t('sections.testimonials.title')}</span>
                </h2>
            </Reveal>

            <div
                className="group relative mt-12 overflow-hidden"
                role="region"
                aria-label="Testimonials"
            >
                <div
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream-50 to-transparent"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream-50 to-transparent"
                    aria-hidden
                />

                <motion.div
                    className="flex w-max items-stretch gap-5 will-change-transform"
                    animate={reduce ? undefined : { x: ['0%', '-50%'] }}
                    transition={
                        reduce
                            ? undefined
                            : { duration: 60, ease: 'linear', repeat: Infinity }
                    }
                >
                    {loop.map((tItem, idx) => (
                        <motion.article
                            key={`${tItem.id}-${idx}`}
                            className="flex h-54 w-[320px] shrink-0 flex-col rounded-3xl bg-white/95 p-6 shadow-soft ring-1 ring-gold-100/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-cute"
                            aria-hidden={idx >= testimonials.length}
                        >
                            <div className="flex items-center justify-between">
                                <Quotes weight="fill" className="text-gold-300" size={26} />
                                <div className="flex gap-0.5 text-gold-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} weight="fill" size={14} />
                                    ))}
                                </div>
                            </div>
                            <p className="mt-3 line-clamp-5 flex-1 text-sm leading-relaxed text-stone-600">
                                {pickTranslation(tItem.message, locale)}
                            </p>
                            <div className="mt-5 flex items-center gap-3">
                                {tItem.avatar_url ? (
                                    <img
                                        src={tItem.avatar_url}
                                        alt=""
                                        loading="lazy"
                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-soft"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-200 to-gold-400 text-sm font-semibold text-white shadow-soft">
                                        {tItem.client_name.charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-stone-800">{tItem.client_name}</p>
                                    {tItem.client_role && (
                                        <p className="truncate text-xs text-stone-500">{tItem.client_role}</p>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
