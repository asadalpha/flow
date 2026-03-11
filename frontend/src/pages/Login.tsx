import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            toast({ variant: 'destructive', title: 'Authentication Failed', description: 'Google sign-in failed. Please try again.' });
        }
        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                authLogin(token, user);
                toast({ variant: 'success', title: 'Welcome back!', description: 'Successfully signed in with Google.' });
                navigate('/dashboard');
            } catch {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to process authentication.' });
            }
        }
    }, [searchParams, authLogin, navigate, toast]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const res = await login(data);
            authLogin(res.token, res.data.user);
            toast({ variant: 'success', title: 'Welcome back!', description: 'Successfully signed in.' });
            navigate('/dashboard');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Login Failed', description: err.response?.data?.message || 'Invalid credentials. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-stretch bg-[#080808] relative overflow-hidden">

            {/* ── Left decorative panel (hidden on mobile) ── */}
            <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden border-r border-white/5">
                {/* Amber mesh */}
                <div className="absolute inset-0"
                     style={{
                         background: 'radial-gradient(ellipse 80% 60% at 30% 60%, rgba(249,187,48,0.06) 0%, transparent 60%)',
                     }} />
                <div className="bg-grid absolute inset-0 opacity-40" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                         style={{ background: 'linear-gradient(135deg, #f9bb30, #f59e0b)' }}>
                        <div className="w-3 h-3 rounded-full bg-black" />
                    </div>
                    <span className="text-xl font-heading font-bold text-white tracking-tight">Flow</span>
                </div>

                {/* Editorial quote */}
                <div className="relative z-10 space-y-4">
                    <div className="w-10 h-0.5 bg-amber-400/60" />
                    <blockquote className="text-2xl font-heading font-semibold text-white/90 leading-snug">
                        Every great career started with a single application.
                    </blockquote>
                    <p className="text-sm text-amber-400/60 font-medium tracking-wide uppercase">Track every step</p>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10 grid grid-cols-2 gap-4">
                    {[
                        { label: 'Applications tracked', value: '10k+' },
                        { label: 'Users hired', value: '2k+' },
                    ].map((s) => (
                        <div key={s.label} className="glass-card rounded-xl p-4 border border-white/5">
                            <div className="text-2xl font-heading font-bold amber-gradient-text">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right: login form ── */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative">
                {/* Subtle radial */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'radial-gradient(ellipse 60% 50% at 60% 40%, rgba(249,187,48,0.03) 0%, transparent 60%)' }} />

                <div className="w-full max-w-sm relative z-10 animate-scale-in">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2.5 mb-8">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                             style={{ background: 'linear-gradient(135deg, #f9bb30, #f59e0b)' }}>
                            <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        </div>
                        <span className="text-xl font-heading font-bold text-white">Flow</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground text-sm mt-1.5">Sign in to continue your journey</p>
                    </div>

                    <div className="space-y-4">
                        {/* Google */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-3 text-sm font-medium text-foreground group hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3">
                            <div className="flex-1 h-px bg-white/8" />
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-white/8" />
                        </div>

                        {/* Email form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                                <Input
                                    id="email" type="email" placeholder="you@example.com"
                                    {...register('email')}
                                    className="h-11 bg-white/[0.03] border-white/10 focus:border-amber-400/40 focus:ring-amber-400/20"
                                />
                                {errors.email && <p className="text-xs text-destructive animate-fade-in">{errors.email.message as string}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                                <Input
                                    id="password" type="password"
                                    {...register('password')}
                                    className="h-11 bg-white/[0.03] border-white/10 focus:border-amber-400/40 focus:ring-amber-400/20"
                                />
                                {errors.password && <p className="text-xs text-destructive animate-fade-in">{errors.password.message as string}</p>}
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mt-1"
                                style={{
                                    background: isLoading ? undefined : 'linear-gradient(135deg, #f9bb30, #f59e0b)',
                                    color: '#0a0a0a',
                                    boxShadow: '0 4px 20px rgba(249,187,48,0.25)',
                                }}
                            >
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
                            </Button>
                        </form>
                    </div>

                    <p className="text-sm text-muted-foreground text-center mt-8">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
