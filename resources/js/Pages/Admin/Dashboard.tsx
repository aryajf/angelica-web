import { Link, usePage } from '@inertiajs/react';
import { ChatTeardropDots, Images, Sparkle, User } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';

interface DashboardProps {
    stats: { documentations: number; features: number; testimonials: number };
}

export default function Dashboard() {
    const { props } = usePage<DashboardProps & Record<string, unknown>>();
    const { t } = useTranslation();

    const tiles = [
        {
            href: route('admin.hero.edit'),
            label: t('admin.hero'),
            value: '1',
            icon: User,
        },
        {
            href: route('admin.documentations.index'),
            label: t('admin.documentations'),
            value: props.stats.documentations,
            icon: Images,
        },
        {
            href: route('admin.features.index'),
            label: t('admin.features'),
            value: props.stats.features,
            icon: Sparkle,
        },
        {
            href: route('admin.testimonials.index'),
            label: t('admin.testimonials'),
            value: props.stats.testimonials,
            icon: ChatTeardropDots,
        },
    ];

    return (
        <AdminLayout title={t('admin.dashboard')}>
            <h1 className="text-2xl font-bold text-stone-800">{t('admin.dashboard')}</h1>
            <p className="text-sm text-stone-500">A cosy overview of your portfolio content.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {tiles.map((tile) => (
                    <Link
                        key={tile.href}
                        href={tile.href}
                        className="card flex flex-col gap-3 transition hover:-translate-y-1 hover:shadow-cute"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 ring-1 ring-gold-100">
                            <tile.icon weight="duotone" size={20} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-stone-500">{tile.label}</p>
                            <p className="mt-1 text-2xl font-bold text-stone-800">{tile.value}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
