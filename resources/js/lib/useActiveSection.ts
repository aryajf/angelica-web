import { useCallback, useEffect, useRef, useState } from 'react';

export function useActiveSection(
    ids: string[],
    offset = 96,
): [string, (id: string) => void] {
    const [active, setActive] = useState<string>(ids[0] ?? '');
    const lockRef = useRef<number>(0);

    const setActiveExplicit = useCallback((id: string) => {
        setActive(id);
        lockRef.current = Date.now() + 1200;
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || ids.length === 0) return;
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (Date.now() < lockRef.current) return;
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) {
                    setActive(visible[0].target.id);
                    return;
                }
                // nothing intersecting in the band — pick the closest above viewport top
                const top = window.scrollY + offset + 1;
                let closest = elements[0].id;
                for (const el of elements) {
                    if (el.offsetTop <= top) closest = el.id;
                }
                setActive(closest);
            },
            {
                rootMargin: `-${offset}px 0px -55% 0px`,
                threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
            },
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [ids, offset]);

    return [active, setActiveExplicit];
}
