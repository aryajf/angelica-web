import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Reveal from '@/Components/Reveal';
import { resolveIcon } from '@/lib/icons';
import { pickTranslation } from '@/lib/utils';
import type { Feature, Locale } from '@/types';

export default function WhyHireMe({ features, locale }: { features: Feature[]; locale: Locale }) {
    const { t } = useTranslation();

    return (
        <section id="about" className="relative mx-auto max-w-6xl px-6 py-20">
            <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-b from-transparent via-white/40 to-transparent"
                aria-hidden
            />

            <Reveal className="text-center">
                <span className="pill">{t('sections.whyHire.eyebrow')}</span>
                <h2 className="mt-3 text-3xl font-bold md:text-5xl">
                    <span className="text-shimmer">{t('sections.whyHire.title')}</span>
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-500">
                    {t('sections.whyHire.subtitle')}
                </p>
            </Reveal>

            <div className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f, i) => {
                    const Icon = resolveIcon(f.icon);
                    return (
                        <motion.div
                            key={f.id}
                            className="group relative h-full"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-15% 0px' }}
                            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
                            whileHover={{ y: -6 }}
                        >
                            <div
                                className="absolute -inset-px rounded-3xl bg-gradient-to-br from-gold-200 via-gold-100 to-cream-100 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100"
                                aria-hidden
                            />
                            <div className="relative flex h-full flex-col rounded-3xl bg-white/95 p-6 shadow-soft ring-1 ring-gold-100/70 backdrop-blur transition-shadow duration-500 group-hover:shadow-cute">
                                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-100 to-cream-100 ring-1 ring-gold-200">
                                    <span className="absolute inset-0 rounded-2xl bg-gold-200/40 blur-md transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                                    <motion.span
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                                        className="relative"
                                    >
                                        <Icon size={28} weight="duotone" className="text-gold-600" />
                                    </motion.span>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-stone-800">
                                    {pickTranslation(f.title, locale)}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                                    {pickTranslation(f.description, locale)}
                                </p>
                                <div
                                    className="mt-4 h-px w-12 origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                                    aria-hidden
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
