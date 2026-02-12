import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TESTIMONIALS } from '../../../utils/constants';
import { Quote } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};

export function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="testimonials" className="relative py-32 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6"
                    >
                        Testimonials
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                        Loved by Job Seekers
                    </h2>
                    <p className="text-lg text-white/40 max-w-2xl mx-auto">
                        See what our users have to say about their experience with Flow.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    style={{ perspective: 1000 }}
                >
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            variants={cardVariants}
                            whileHover={{
                                y: -10,
                                rotateY: 5,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative"
                        >
                            {/* Card Glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                            {/* Card */}
                            <div className="relative h-full p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.06] group-hover:border-white/10 transition-colors duration-300">
                                {/* Quote Icon */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6"
                                >
                                    <Quote className="w-5 h-5 text-white/60" />
                                </motion.div>

                                {/* Content */}
                                <p className="text-white/60 leading-relaxed mb-8">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{testimonial.name}</p>
                                        <p className="text-sm text-white/40">
                                            {testimonial.role} at {testimonial.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative Shine */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
