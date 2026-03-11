import { motion } from 'framer-motion';
import {
    Navbar,
    HeroSection,
    FeaturesSection,
    HowItWorksSection,
    CTASection,
} from '../features/landing/components';

export default function Landing() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-white/20 selection:text-white"
        >
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="relative">
                {/* Subtle Background Grain */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />

                {/* Hero Section */}
                <HeroSection />

                {/* Features Section */}
                <FeaturesSection />

                {/* How It Works Section */}
                <HowItWorksSection />

                {/* CTA Section */}
                <CTASection />
            </main>

            {/* Simple Copyright Footer */}
            <footer className="py-8 text-center text-sm text-white/20 border-t border-white/5">
                <p>&copy; {new Date().getFullYear()} Flow. Crafted by an indie dev.</p>
            </footer>
        </motion.div>
    );
}
