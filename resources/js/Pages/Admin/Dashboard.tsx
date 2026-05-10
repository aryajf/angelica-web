import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    ChatTeardropDots,
    Images,
    Sparkle,
    TrendUp,
    User,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';

interface DashboardProps {
    stats: { documentations: number; features: number; testimonials: number };
}

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function Dashboard() {
    const { props } = usePage<DashboardProps & Record<string, unknown>>();
    const { t } = useTranslation();
    const { stats } = props;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const tiles = [
        {
            href: route('admin.hero.edit'),
            label: t('admin.hero'),
            desc: 'Bio, avatar & social links',
            value: '1',
            icon: User,
            gradient: 'from-violet-500 to-purple-600',
            ring: 'ring-violet-200',
            bg: 'bg-violet-50',
            text: 'text-violet-700',
        },
        {
            href: route('admin.documentations.index'),
            label: t('admin.documentations'),
            desc: 'Portfolio & media gallery',
            value: stats.documentations,
            icon: Images,
            gradient: 'from-amber-500 to-orange-600',
            ring: 'ring-amber-200',
            bg: 'bg-amber-50',
            text: 'text-amber-700',
        },
        {
            href: route('admin.features.index'),
            label: t('admin.features'),
            desc: 'Skills & highlights',
            value: stats.features,
            icon: Sparkle,
            gradient: 'from-emerald-500 to-teal-600',
            ring: 'ring-emerald-200',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
        },
        {
            href: route('admin.testimonials.index'),
            label: t('admin.testimonials'),
            desc: 'Client reviews & feedback',
            value: stats.testimonials,
            icon: ChatTeardropDots,
            gradient: 'from-sky-500 to-blue-600',
            ring: 'ring-sky-200',
            bg: 'bg-sky-50',
            text: 'text-sky-700',
        },
    ];

    const total = stats.documentations + stats.features + stats.testimonials + 1;

    return (
        <AdminLayout title={t('admin.dashboard')}>
            {/* greeting */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
                <h1 className="text-3xl font-bold text-stone-800">
                    {greeting} ✨
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                    Here's an overview of your portfolio content.
                </p>
            </motion.div>

            {/* summary strip */}
            <motion.div
                className="mt-6 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
            >
                <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-700 ring-1 ring-gold-100">
                    <TrendUp weight="bold" size={16} />
                    {total} total items
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-4 py-2 text-sm text-stone-500 ring-1 ring-stone-100">
                    <Calendar weight="duotone" size={16} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </motion.div>

            {/* stat cards */}
            <motion.div
                className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {tiles.map((tile) => (
                    <motion.div key={tile.href} variants={cardVariants}>
                        <Link
                            href={tile.href}
                            className={`group relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-white p-6 shadow-soft ring-1 ${tile.ring} transition-all duration-300 hover:-translate-y-1 hover:shadow-cute`}
                        >
                            {/* decorative gradient blob */}
                            <div
                                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tile.gradient} opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 group-hover:blur-xl`}
                            />

                            <div className="flex items-center justify-between">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tile.gradient} text-white shadow-md`}>
                                    <tile.icon weight="fill" size={22} />
                                </div>
                                <span className="text-3xl font-black tabular-nums text-stone-800">
                                    {tile.value}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-stone-800">{tile.label}</p>
                                <p className="mt-0.5 text-xs text-stone-400">{tile.desc}</p>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-medium text-stone-400 transition group-hover:text-stone-600">
                                Manage
                                <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* quick actions */}
            <motion.div
                className="mt-8 rounded-3xl bg-gradient-to-br from-gold-50 via-amber-50 to-orange-50 p-6 ring-1 ring-gold-100/60"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
            </motion.div>
        </AdminLayout>
    );
}
