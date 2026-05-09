import { usePage } from '@inertiajs/react';
import Gallery from '@/Components/Gallery';
import Hero from '@/Components/Hero';
import MarqueeTestimonials from '@/Components/MarqueeTestimonials';
import WhyHireMe from '@/Components/WhyHireMe';
import PublicLayout from '@/Layouts/PublicLayout';
import type {
    Documentation,
    Feature,
    Hero as HeroType,
    SharedProps,
    Testimonial,
} from '@/types';

interface HomeProps extends SharedProps {
    hero: HeroType;
    documentations: Documentation[];
    features: Feature[];
    testimonials: Testimonial[];
}

export default function Home() {
    const { props } = usePage<HomeProps>();

    return (
        <PublicLayout>
            <Hero hero={props.hero} locale={props.locale} />
            <Gallery documentations={props.documentations} locale={props.locale} />
            <WhyHireMe features={props.features} locale={props.locale} />
            <MarqueeTestimonials testimonials={props.testimonials} locale={props.locale} />
        </PublicLayout>
    );
}
