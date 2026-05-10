import { Head, Link } from '@inertiajs/react';
import { HouseSimple, MagnifyingGlass, Sparkle } from '@phosphor-icons/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface Props {
    status: number;
}

/* ── Floating sparkle particles ── */
function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
    return (
        <motion.div
            className="pointer-events-none absolute text-gold-300"
            style={{ left: x, top: y }}
            animate={{
                y: [0, -20, 0, 15, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.3, 0.9, 1.1, 1],
            }}
            transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
            <Sparkle weight="fill" size={size} />
        </motion.div>
    );
}

/* ── Cute ghost SVG that follows cursor ── */
function CuteGhost() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const eyeX = useTransform(mouseX, [-400, 400], [-6, 6]);
    const eyeY = useTransform(mouseY, [-400, 400], [-4, 4]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            mouseX.set(e.clientX - cx);
            mouseY.set(e.clientY - cy);
        };
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="relative mx-auto"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
            <svg viewBox="0 0 200 220" className="mx-auto h-48 w-48 drop-shadow-lg sm:h-56 sm:w-56">
                {/* body */}
                <motion.path
                    d="M100 10 C 40 10, 10 60, 10 110 L 10 190 Q 30 170 50 190 Q 70 210 90 190 Q 100 180 110 190 Q 130 210 150 190 Q 170 170 190 190 L 190 110 C 190 60, 160 10, 100 10 Z"
                    fill="url(#ghostGradient)"
                    stroke="rgb(253 224 71)"
                    strokeWidth="2.5"
                    animate={{ d: [
                        "M100 10 C 40 10, 10 60, 10 110 L 10 190 Q 30 170 50 190 Q 70 210 90 190 Q 100 180 110 190 Q 130 210 150 190 Q 170 170 190 190 L 190 110 C 190 60, 160 10, 100 10 Z",
                        "M100 10 C 40 10, 10 60, 10 110 L 10 195 Q 30 175 50 195 Q 70 215 90 195 Q 100 185 110 195 Q 130 215 150 195 Q 170 175 190 195 L 190 110 C 190 60, 160 10, 100 10 Z",
                        "M100 10 C 40 10, 10 60, 10 110 L 10 190 Q 30 170 50 190 Q 70 210 90 190 Q 100 180 110 190 Q 130 210 150 190 Q 170 170 190 190 L 190 110 C 190 60, 160 10, 100 10 Z",
                    ]}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <defs>
                    <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(255 253 242)" />
                        <stop offset="100%" stopColor="rgb(254 249 195)" />
                    </linearGradient>
                </defs>

                {/* blush */}
                <ellipse cx="60" cy="120" rx="16" ry="10" fill="rgb(253 186 116)" opacity="0.3" />
                <ellipse cx="140" cy="120" rx="16" ry="10" fill="rgb(253 186 116)" opacity="0.3" />

                {/* eyes — follow cursor */}
                <g>
                    <ellipse cx="75" cy="95" rx="14" ry="16" fill="white" stroke="rgb(202 138 4)" strokeWidth="1.5" />
                    <motion.ellipse cx="75" cy="95" rx="6" ry="7" fill="rgb(68 64 60)" style={{ translateX: eyeX, translateY: eyeY }} />
                    <motion.circle cx="72" cy="91" r="2.5" fill="white" style={{ translateX: eyeX, translateY: eyeY }} />
                </g>
                <g>
                    <ellipse cx="125" cy="95" rx="14" ry="16" fill="white" stroke="rgb(202 138 4)" strokeWidth="1.5" />
                    <motion.ellipse cx="125" cy="95" rx="6" ry="7" fill="rgb(68 64 60)" style={{ translateX: eyeX, translateY: eyeY }} />
                    <motion.circle cx="122" cy="91" r="2.5" fill="white" style={{ translateX: eyeX, translateY: eyeY }} />
                </g>

                {/* mouth */}
                <motion.path
                    d="M 88 130 Q 100 145 112 130"
                    fill="none"
                    stroke="rgb(120 53 15)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    animate={{ d: [
                        "M 88 130 Q 100 145 112 130",
                        "M 88 132 Q 100 140 112 132",
                        "M 88 130 Q 100 145 112 130",
                    ]}}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
            </svg>
        </motion.div>
    );
}

const titles: Record<number, string> = {
    404: "Oops! This page went on vacation 🏖️",
    403: "Hey! You're not allowed here 🔒",
    500: "Something broke... our bad 😵",
    503: "We're taking a quick nap 😴",
};

const subtitles: Record<number, string> = {
    404: "The page you're looking for doesn't exist or has been moved. But our cute ghost friend will keep you company!",
    403: "You don't have permission to access this page. Maybe try logging in?",
    500: "Our servers had a little hiccup. Don't worry, we're working on it!",
    503: "We'll be back soon! We're just updating some things.",
};

export default function Error({ status }: Props) {
    const title = titles[status] ?? titles[404];
    const subtitle = subtitles[status] ?? subtitles[404];

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
            <Head title={`${status} — Angelica`} />

            {/* background decorations */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-gold-300/20 blur-3xl animate-blob" />
                <div className="absolute right-1/4 bottom-1/4 h-56 w-56 rounded-full bg-amber-200/25 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gold-100/30 blur-3xl animate-float-slower" />
            </div>

            {/* floating sparkles */}
            <FloatingParticle delay={0} x="15%" y="20%" size={16} />
            <FloatingParticle delay={1} x="80%" y="15%" size={20} />
            <FloatingParticle delay={2} x="25%" y="75%" size={14} />
            <FloatingParticle delay={0.5} x="70%" y="70%" size={18} />
            <FloatingParticle delay={1.5} x="50%" y="10%" size={12} />
            <FloatingParticle delay={3} x="90%" y="50%" size={16} />
            <FloatingParticle delay={2.5} x="8%" y="55%" size={22} />

            {/* ghost */}
            <CuteGhost />

            {/* error code */}
            <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <span className="inline-block text-8xl font-black tabular-nums text-shimmer sm:text-9xl">
                    {status}
                </span>
            </motion.div>

            {/* title */}
            <motion.h1
                className="mt-2 max-w-lg text-center text-2xl font-bold text-stone-800 sm:text-3xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
            >
                {title}
            </motion.h1>

            {/* subtitle */}
            <motion.p
                className="mt-3 max-w-md text-center text-sm leading-relaxed text-stone-500"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
            >
                {subtitle}
            </motion.p>

            {/* go home button */}
            <motion.div
                className="mt-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Link
                    href="/"
                    className="btn-primary group gap-3 text-base"
                >
                    <HouseSimple weight="fill" size={18} className="transition-transform group-hover:-translate-y-0.5" />
                    Take me home
                    <Sparkle weight="fill" size={14} className="animate-spin-slow text-gold-200" />
                </Link>
            </motion.div>

            {/* footer */}
            <motion.p
                className="mt-12 text-center text-xs text-stone-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                © {new Date().getFullYear()} Angelica · Portfolio
            </motion.p>
        </div>
    );
}
