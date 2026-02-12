import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { LayoutDashboard, FileText, LogOut, User } from 'lucide-react';
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
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Resume Analyzer', path: '/resume-analyzer' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 glass-nav hidden md:flex flex-col animate-fade-in shadow-2xl z-50">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        </div>
                        <h1 className="text-xl font-heading font-bold tracking-tight text-white">Flow</h1>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 pl-1 font-medium">Track your career journey</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group animate-fade-in relative overflow-hidden",
                                location.pathname === item.path
                                    ? "bg-primary/10 text-primary shadow-lg border border-primary/10"
                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground hover:translate-x-1"
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {location.pathname === item.path && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" />
                            )}
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-300",
                                location.pathname === item.path ? "text-primary" : "group-hover:scale-110"
                            )} />
                            <span className="relative">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-white/10">
                            <User className="w-5 h-5 text-gray-300" />
                        </div>
                        <div className="overflow-hidden flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-200">{user?.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive hover:pl-6 rounded-xl text-muted-foreground"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
