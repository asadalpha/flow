import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { APP_TAGLINE, APP_DESCRIPTION } from '../../../utils/constants';

const fadeUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.2 + i * 0.1,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-16">
            {/* Subtle Gradient Spot */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Minimal Badge */}
                <motion.div
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                    className="mb-8 inline-flex justify-center"
                >
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-white/50 tracking-wide select-none hover:bg-white/10 hover:border-white/10 hover:text-white/70 transition-all duration-300">
                        For Job Seekers
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                    className="text-5xl md:text-7xl font-heading font-medium tracking-tight text-white mb-8 leading-[1.1]"
                >
                    Streamline your <br />
                    <span className="text-white/40">job search journey.</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                    className="text-lg md:text-xl text-white/40 max-w-xl mx-auto mb-12 font-light leading-relaxed"
                >
                    A minimal workspace to track applications, analyze resumes, and organize your career growth. No distractions.
                </motion.p>

                {/* Actions */}
                <motion.div
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/register">
                        <button className="group relative px-6 py-3 bg-white text-black font-medium text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden">
                            <span className="relative z-10">Start Tracking</span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </Link>
                    <a
                        href="#features"
                        className="px-6 py-3 text-sm text-white/40 hover:text-white transition-colors duration-300 font-medium"
                    >
                        Explore Features
                    </a>
                </motion.div>
            </div>

            {/* Minimal Dashboard Preview (Abstract) */}
            <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                className="mt-24 w-full max-w-5xl relative"
            >
                <div className="aspect-[16/9] rounded-xl bg-[#080808] border border-white/5 shadow-2xl overflow-hidden relative group">
                    {/* Subtle inner shadow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-50" />

                    {/* Mock UI Elements - Minimal */}
                    <div className="absolute top-0 inset-x-0 h-10 border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    </div>

                    <div className="absolute top-14 left-4 bottom-4 w-48 border-r border-white/5 hidden md:block" />

                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-white/[0.02] to-transparent rounded-lg blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

                </div>
            </motion.div>
        </section>
    );
}
