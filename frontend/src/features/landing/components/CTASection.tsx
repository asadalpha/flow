import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function CTASection() {
    return (
        <section className="py-40 px-6 border-t border-white/5">
            <div className="max-w-3xl mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-heading font-medium text-white mb-8 tracking-tight"
                >
                    Stop managing sheets. <br />
                    <span className="text-white/40">Start landing jobs.</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center"
                >
                    <Link to="/register">
                        <button className="text-white/60 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-all duration-300 text-sm tracking-wide uppercase">
                            Get Started Now
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
