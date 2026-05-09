import { Head, usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types';

export default function SeoHead({ title, description }: { title?: string; description?: string }) {
    const { props } = usePage<SharedProps>();
    const finalTitle = title ?? props.seo.title;
    const finalDescription = description ?? props.seo.description;

    return (
        <Head title={finalTitle}>
            <meta name="description" content={finalDescription} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content={props.locale === 'id' ? 'id_ID' : 'en_US'} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
        </Head>
    );
}
