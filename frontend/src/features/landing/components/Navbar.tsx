import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../../utils/constants';

const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export function Navbar() {
    return (
        <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
        >
            <div className="mx-auto max-w-7xl flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center group-hover:bg-white/90 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                    <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors tracking-wide">
                        {APP_NAME}
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <Link
                        to="/login"
                        className="text-xs text-white/50 hover:text-white transition-colors duration-300 uppercase tracking-wider"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/register"
                        className="text-xs bg-white/10 text-white px-4 py-2 rounded-md hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/5 uppercase tracking-wider"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
