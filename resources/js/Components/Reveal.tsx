import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { type PropsWithChildren } from 'react';

interface Props {
    delay?: number;
    y?: number;
    once?: boolean;
    className?: string;
}

export default function Reveal({
    children,
    delay = 0,
    y = 24,
    once = true,
    className,
}: PropsWithChildren<Props>) {
    const reduce = useReducedMotion();

    const variants: Variants = {
        hidden: { opacity: 0, y: reduce ? 0 : y },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay },
        },
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: '-15% 0px' }}
            variants={variants}
        >
            {children}
        </motion.div>
    );
}
