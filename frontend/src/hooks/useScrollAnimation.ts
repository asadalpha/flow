import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, type RefObject } from 'react';

interface ScrollAnimationOptions {
    offset?: [string, string];
}

interface ScrollAnimationReturn {
    ref: RefObject<HTMLElement>;
    scrollYProgress: MotionValue<number>;
    opacity: MotionValue<number>;
    y: MotionValue<number>;
    scale: MotionValue<number>;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}): ScrollAnimationReturn {
    const { offset = ['start end', 'end start'] } = options;
    const ref = useRef<HTMLElement>(null!);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: offset as any,
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

    return { ref, scrollYProgress, opacity, y, scale };
}

export function useParallax(value: MotionValue<number>, distance: number): MotionValue<number> {
    return useTransform(value, [0, 1], [-distance, distance]);
}
