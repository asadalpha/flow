import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { LayoutDashboard, FileText, LogOut, User, Kanban } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard' },
        { icon: Kanban,          label: 'Kanban',         path: '/kanban' },
        { icon: FileText,        label: 'Resume',          path: '/resume-analyzer' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">

            {/* ── Desktop Sidebar ── */}
            <aside className="w-60 glass-nav hidden md:flex flex-col animate-fade-in shadow-2xl z-50 relative">
                {/* Amber top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

                {/* Logo */}
                <div className="px-5 py-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                             style={{ background: 'linear-gradient(135deg, #f9bb30, #f59e0b)' }}>
                            <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        </div>
                        <div>
                            <h1 className="text-lg font-heading font-bold tracking-tight text-white leading-none">Flow</h1>
                            <p className="text-[10px] text-amber-400/60 mt-0.5 font-medium tracking-wider uppercase">Career Tracker</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-1">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium group animate-fade-in relative overflow-hidden",
                                    isActive
                                        ? "bg-amber-400/10 text-amber-300"
                                        : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                )}
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                {/* Active amber left bar */}
                                <div className={cn(
                                    "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full transition-all duration-300",
                                    isActive ? "h-5 bg-amber-400 shadow-[0_0_8px_rgba(249,187,48,0.6)]" : "h-0"
                                )} />

                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/8 via-transparent to-transparent" />
                                )}

                                <item.icon className={cn(
                                    "w-4 h-4 flex-shrink-0 transition-all duration-300 relative z-10",
                                    isActive ? "text-amber-400" : "group-hover:text-foreground group-hover:scale-110"
                                )} />
                                <span className="relative z-10 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div className="p-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10"
                             style={{ background: 'linear-gradient(135deg, rgba(249,187,48,0.15), rgba(0,0,0,0.3))' }}>
                            <User className="w-4 h-4 text-amber-400/70" />
                        </div>
                        <div className="overflow-hidden flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-gray-100">{user?.name || 'User'}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2.5 h-9 text-sm transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-muted-foreground px-3"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto mb-16 md:mb-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* ── Mobile Bottom Navigation ── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around py-1 px-2 z-50 border-t border-white/5"
                 style={{
                     background: 'rgba(6, 6, 6, 0.95)',
                     backdropFilter: 'blur(20px)',
                     WebkitBackdropFilter: 'blur(20px)',
                 }}>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 px-4 rounded-xl transition-all duration-300 min-w-0",
                                isActive ? "text-amber-400" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_6px_rgba(249,187,48,0.7)]")} />
                            <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-1 p-2 px-4 rounded-xl transition-all duration-300 text-muted-foreground hover:text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] font-semibold tracking-wide">Logout</span>
                </button>
            </nav>
        </div>
    );
}
