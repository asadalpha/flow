import { motion } from 'framer-motion';
import { FEATURES } from '../../../utils/constants';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

export function FeaturesSection() {
    return (
        <section id="features" className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-heading font-medium text-white mb-4">
                            Designed for focus.
                        </h2>
                        <p className="text-white/40 leading-relaxed">
                            Every feature is crafted to help you move forward without the noise.
                            Simple, powerful, and effective.
                        </p>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden"
                >
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={feature.id}
                            variants={itemVariants}
                            className="group bg-[#030303] p-8 hover:bg-[#050505] transition-colors duration-300 relative"
                        >
                            <div className="mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs font-mono">0{i + 1}</span>
                            </div>

                            <h3 className="text-lg font-medium text-white mb-3 group-hover:text-white transition-colors duration-300">
                                {feature.title}
                            </h3>

                            <p className="text-sm text-white/40 leading-relaxed max-w-xs group-hover:text-white/60 transition-colors duration-300">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
