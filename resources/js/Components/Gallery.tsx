import { ArrowUpRight, CalendarBlank } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'framer-motion';
import { type MouseEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentationModal from '@/Components/DocumentationModal';
import LazyImage from '@/Components/LazyImage';
import Reveal from '@/Components/Reveal';
import { formatDateRange, pickTranslation } from '@/lib/utils';
import type { Documentation, Locale } from '@/types';

function TiltCard({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    const onMove = (e: MouseEvent<HTMLDivElement>) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ref.current.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateZ(2px)`;
    };
    const onLeave = () => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    return (
        <div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`tilt-3d h-full transition-transform duration-300 ease-out ${className ?? ''}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}

export default function Gallery({
    documentations,
    locale,
}: {
    documentations: Documentation[];
    locale: Locale;
}) {
    const { t } = useTranslation();
    const [openItem, setOpenItem] = useState<Documentation | null>(null);

    return (
        <section id="work" className="relative mx-auto max-w-6xl px-6 py-20">
            <Reveal className="text-center">
                <span className="pill">{t('sections.documentation.eyebrow')}</span>
                <h2 className="mt-3 text-3xl font-bold md:text-5xl">
                    <span className="text-shimmer">{t('sections.documentation.title')}</span>
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-500">
                    {t('sections.documentation.subtitle')}
                </p>
            </Reveal>

            <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {documentations.map((d, i) => {
                    const range = formatDateRange(d.started_at, d.ended_at, locale, t('modal.present'));
                    return (
                        <motion.article
                            key={d.id}
                            className="group h-full"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-12% 0px' }}
                            transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
                        >
                            <TiltCard className="h-full">
                                <button
                                    type="button"
                                    onClick={() => setOpenItem(d)}
                                    aria-label={t('modal.viewDetails')}
                                    className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white/95 text-left shadow-soft ring-1 ring-gold-100/70 transition-shadow duration-500 group-hover:shadow-cute"
                                >
                                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                                        <LazyImage
                                            src={d.image_url}
                                            alt={pickTranslation(d.title, locale)}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                        {range && (
                                            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gold-700 shadow-soft ring-1 ring-gold-100 backdrop-blur">
                                                <CalendarBlank weight="duotone" size={12} />
                                                {range}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className="flex flex-1 flex-col gap-1.5 p-5"
                                        style={{ transform: 'translateZ(20px)' }}
                                    >
                                        <h3 className="font-semibold text-stone-800">
                                            {pickTranslation(d.title, locale)}
                                        </h3>
                                        <p className="line-clamp-3 text-sm leading-relaxed text-stone-500">
                                            {pickTranslation(d.description, locale)}
                                        </p>
                                    </div>
                                </button>
                            </TiltCard>
                        </motion.article>
                    );
                })}
            </div>

            <DocumentationModal item={openItem} locale={locale} onClose={() => setOpenItem(null)} />
        </section>
    );
}
