import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/Components/Reveal';
import { resolveIcon } from '@/lib/icons';
import { pickTranslation } from '@/lib/utils';
import type { Feature, Locale } from '@/types';

function useTypewriter(speed = 30) {
    const [text, setText] = useState('');
    const [done, setDone] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stop = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; }, []);
    const type = useCallback((full: string) => {
        stop(); setText(''); setDone(false);
        let i = 0;
        const tick = () => { if (i >= full.length) { setDone(true); return; } setText(full.slice(0, i + 1)); i++; timer.current = setTimeout(tick, speed); };
        tick();
    }, [speed, stop]);
    useEffect(() => stop, [stop]);
    return { text, done, type, stop };
}

export default function WhyHireMe({ features, locale }: { features: Feature[]; locale: Locale }) {
    const { t } = useTranslation();
    const [activeIdx, setActiveIdx] = useState(0);
    const { text, done, type } = useTypewriter(30);
    const [started, setStarted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const current = features[activeIdx];
    const isTalking = !done;

    useEffect(() => {
        if (!sectionRef.current || started || features.length === 0) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
            { threshold: 0.25 },
        );
        obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, [started, features.length]);

    useEffect(() => {
        if (!started || features.length === 0) return;
        type(pickTranslation(features[activeIdx].description, locale));
    }, [activeIdx, started, locale]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!done) return;
        const timer = setTimeout(() => {
            setActiveIdx(prev => (prev + 1) % features.length);
        }, 5000);
        return () => clearTimeout(timer);
    }, [done, features.length]);

    if (features.length === 0) return null;
    const Icon = resolveIcon(current.icon);

    return (
        <section id="about" ref={sectionRef} className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-b from-transparent via-white/40 to-transparent" aria-hidden />

            <Reveal className="text-center">
                <span className="pill">{t('sections.whyHire.eyebrow')}</span>
                <h2 className="mt-3 text-2xl font-bold md:text-5xl">
                    <span className="text-shimmer">{t('sections.whyHire.title')}</span>
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-stone-500 md:text-base">
                    {t('sections.whyHire.subtitle')}
                </p>
            </Reveal>

            {/* ── Layout: Speech bubble (left/top) + Mimi (right/bottom) ── */}
            <div className="mx-auto mt-10 max-w-4xl md:mt-14">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-0">

                    {/* ── Speech Bubble ── */}
                    <div className="relative w-full md:flex-1">
                        {/* Arrow pointing right toward Mimi on md+ */}
                        <div className="pointer-events-none absolute -right-3 top-10 hidden h-6 w-6 rotate-45 rounded-sm bg-white shadow-sm ring-1 ring-gold-100/60 md:block" />
                        {/* Arrow pointing down toward Mimi on mobile */}
                        <div className="pointer-events-none absolute -bottom-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rotate-45 rounded-sm bg-white shadow-sm ring-1 ring-gold-100/60 max-md:block" />

                        <div className="relative rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gold-100/70 backdrop-blur md:rounded-3xl md:p-8">
                            {/* Feature icon + title */}
                            <div className="mb-3 flex items-center gap-3 md:mb-5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-100 to-cream-100 ring-1 ring-gold-200/60 md:h-14 md:w-14 md:rounded-2xl">
                                    <Icon size={22} weight="duotone" className="text-gold-600 md:hidden" />
                                    <Icon size={28} weight="duotone" className="hidden text-gold-600 md:block" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-stone-800 md:text-xl">
                                        {pickTranslation(current.title, locale)}
                                    </h3>
                                    <p className="text-[10px] font-semibold text-gold-500 md:text-xs">
                                        {activeIdx + 1} / {features.length}
                                    </p>
                                </div>
                            </div>

                            {/* Typing text */}
                            <p className="min-h-[3.5rem] text-sm leading-relaxed text-stone-600 md:min-h-[4rem] md:text-lg md:leading-relaxed">
                                {text}
                                {isTalking && (
                                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-gold-400 align-middle md:h-5" />
                                )}
                            </p>

                            {/* Progress dots */}
                            <div className="mt-5 flex items-center justify-center gap-2 md:mt-6">
                                {features.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIdx(i)}
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            i === activeIdx ? 'w-7 bg-gold-500' : 'w-2 bg-stone-200 hover:bg-gold-300'
                                        }`}
                                        aria-label={`Feature ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Mimi Avatar (right, outside circle, bigger) ── */}
                    <div className="flex flex-col items-center md:ml-6 md:mt-2 md:shrink-0">
                        <img
                            src={isTalking ? '/images/mimi-open.png' : '/images/mimi-closed.png'}
                            alt="Mimi"
                            className="h-36 w-36 drop-shadow-lg transition-transform duration-300 md:h-52 md:w-52"
                            style={{ objectFit: 'contain' }}
                        />
                        <p className="mt-1 font-display text-base font-bold text-stone-700 md:mt-2 md:text-xl lg:text-2xl">
                            Mimi
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
