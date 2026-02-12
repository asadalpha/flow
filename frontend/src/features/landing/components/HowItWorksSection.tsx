import { motion } from 'framer-motion';
import { HOW_IT_WORKS_STEPS } from '../../../utils/constants';

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-32 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-3xl font-heading font-medium text-white mb-4">
                        How it works
                    </h2>
                </div>

                <div className="space-y-16">
                    {HOW_IT_WORKS_STEPS.map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group flex gap-8 md:gap-16 items-start"
                        >
                            <span className="flex-shrink-0 text-xs font-mono text-white/20 pt-1.5 group-hover:text-white/40 transition-colors duration-300">
                                / 0{step.step}
                            </span>

                            <div className="max-w-xl">
                                <h3 className="text-xl font-medium text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                                    {step.title}
                                </h3>
                                <p className="text-white/40 leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
