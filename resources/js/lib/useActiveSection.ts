import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[], offset = 96): string {
    const [active, setActive] = useState<string>(ids[0] ?? '');

    useEffect(() => {
        if (typeof window === 'undefined' || ids.length === 0) return;

        const sections = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);

        if (sections.length === 0) return;

        const compute = () => {
            const scrollY = window.scrollY + offset + 1;
            let current = sections[0].id;
            for (const sec of sections) {
                if (sec.offsetTop <= scrollY) {
                    current = sec.id;
                }
            }
            // pin last section if scrolled to bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
                current = sections[sections.length - 1].id;
            }
            setActive((prev) => (prev === current ? prev : current));
        };

        compute();
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(compute);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [ids, offset]);

    return active;
}
