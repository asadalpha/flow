import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as authRegister } from '../services/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
});

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const res = await authRegister(data);
            login(res.token, res.data.user);
            toast({ variant: 'success', title: 'Account Created!', description: "Welcome to Flow. Let's start tracking your applications." });
            navigate('/dashboard');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Registration Failed', description: err.response?.data?.message || 'Could not create account. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#080808] relative overflow-hidden p-6">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(249,187,48,0.04) 0%, transparent 60%)' }} />
            <div className="bg-grid absolute inset-0 opacity-30" />

            <div className="w-full max-w-sm relative z-10 animate-scale-in">
                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-8">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                         style={{ background: 'linear-gradient(135deg, #f9bb30, #f59e0b)' }}>
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                    </div>
                    <span className="text-xl font-heading font-bold text-white">Flow</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Create account</h1>
                    <p className="text-muted-foreground text-sm mt-1.5">Join and track your job search journey</p>
                </div>

                <div className="space-y-4">
                    {/* Google */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-3 text-sm font-medium text-foreground hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign up with Google
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                            <Input
                                id="name" placeholder="John Doe"
                                {...register('name')}
                                className="h-11 bg-white/[0.03] border-white/10 focus:border-amber-400/40 focus:ring-amber-400/20"
                            />
                            {errors.name && <p className="text-xs text-destructive animate-fade-in">{errors.name.message as string}</p>}
                        </div>
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
                            <p className="text-[11px] text-muted-foreground">8+ characters, one uppercase, one number</p>
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
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
                        </Button>
                    </form>
                </div>

                <p className="text-sm text-muted-foreground text-center mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
