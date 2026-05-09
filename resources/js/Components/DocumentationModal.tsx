import { CalendarBlank, CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateRange, pickTranslation } from '@/lib/utils';
import type { Documentation, Locale } from '@/types';

interface Props {
    item: Documentation | null;
    locale: Locale;
    onClose: () => void;
}

export default function DocumentationModal({ item, locale, onClose }: Props) {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = item?.image_urls?.length ? item.image_urls : item ? [item.image_url] : [];

    const goTo = useCallback(
        (index: number) => {
            setCurrentIndex((images.length + index) % images.length);
        },
        [images.length],
    );

    const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);
    const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [item?.id]);

    useEffect(() => {
        if (!item) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKey);
        };
    }, [item, onClose, prev, next]);

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        className="absolute inset-0 bg-stone-900/70 backdrop-blur-md"
                        onClick={onClose}
                        aria-hidden
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Close button — outside the main modal container */}
                    <motion.button
                        type="button"
                        onClick={onClose}
                        aria-label={t('modal.close')}
                        className="absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow-soft ring-1 ring-stone-200 backdrop-blur transition hover:bg-white hover:scale-110 sm:right-5 sm:top-5 md:right-6 md:top-6"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ delay: 0.15 }}
                    >
                        <X weight="bold" size={18} />
                    </motion.button>

                    <motion.div
                        className="relative z-10 flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-cute md:h-[88vh] md:flex-row"
                        initial={{ opacity: 0, scale: 0.94, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    >
                        {/* image carousel — Instagram-style: full image on dark bg */}
                        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-stone-950 sm:aspect-[4/3] md:aspect-auto md:h-full md:flex-[3]">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={`${item.id}-${currentIndex}`}
                                    src={images[currentIndex]}
                                    alt={pickTranslation(item.title, locale)}
                                    className="absolute inset-0 z-0 m-auto block h-full w-full object-contain"
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                                />
                            </AnimatePresence>

                            {/* soft glow border */}
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" aria-hidden />

                            {/* prev / next arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prev}
                                        aria-label="Previous image"
                                        className="absolute left-2.5 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-sm transition hover:bg-black/60 hover:scale-110 active:scale-95 sm:left-3 sm:h-10 sm:w-10"
                                    >
                                        <CaretLeft weight="bold" size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={next}
                                        aria-label="Next image"
                                        className="absolute right-2.5 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-sm transition hover:bg-black/60 hover:scale-110 active:scale-95 sm:right-3 sm:h-10 sm:w-10"
                                    >
                                        <CaretRight weight="bold" size={18} />
                                    </button>

                                    {/* dot pagination */}
                                    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm sm:bottom-4">
                                        {images.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => goTo(i)}
                                                aria-label={`Go to image ${i + 1}`}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    i === currentIndex
                                                        ? 'w-4 bg-white'
                                                        : 'w-1.5 bg-white/50 hover:bg-white/75'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* info panel */}
                        <div className="flex min-h-0 flex-1 flex-col bg-white md:flex-[2]">
                            <div className="scroll-soft flex-1 space-y-4 overflow-y-auto px-5 py-5">
                                <h3 className="text-xl font-bold leading-snug text-stone-800 md:text-2xl">
                                    {pickTranslation(item.title, locale)}
                                </h3>

                                {item.started_at && (
                                    <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 ring-1 ring-gold-100">
                                        <CalendarBlank weight="duotone" size={14} />
                                        {formatDateRange(
                                            item.started_at,
                                            item.ended_at,
                                            locale,
                                            t('modal.present'),
                                        )}
                                    </div>
                                )}

                                <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600 md:text-[15px]">
                                    {pickTranslation(item.description, locale)}
                                </p>
                            </div>

                            <footer className="border-t border-stone-100 px-5 py-3 text-center text-[11px] uppercase tracking-[0.2em] text-stone-400">
                                Angelica · Portfolio
                            </footer>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
