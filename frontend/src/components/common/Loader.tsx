import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'dots' | 'pulse';
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
};

export function Loader({
    size = 'md',
    variant = 'spinner',
    className
}: LoaderProps) {
    if (variant === 'dots') {
        return (
            <div className={cn('flex items-center gap-1', className)}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={cn(
                            'rounded-full bg-white/60',
                            size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
                        )}
                        animate={{
                            y: [0, -8, 0],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <motion.div
                className={cn(
                    'rounded-full bg-gradient-to-r from-purple-500 to-blue-500',
                    sizeClasses[size],
                    className
                )}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        );
    }

    // Default spinner
    return (
        <motion.div
            className={cn(
                'border-2 border-white/10 border-t-white rounded-full',
                sizeClasses[size],
                className
            )}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    );
}
