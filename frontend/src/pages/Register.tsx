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
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
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
            toast({
                variant: 'success',
                title: 'Account Created!',
                description: 'Welcome to JobFlow. Let\'s start tracking your applications.',
            });
            navigate('/dashboard');
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: err.response?.data?.message || 'Could not create account. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/google`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

            <Card className="w-full max-w-md animate-scale-in hover-lift border-border/50 shadow-2xl">
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <div className="w-3 h-3 rounded-full bg-black" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold tracking-tight text-white">Flow</h1>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription className="text-base">Get started with your job search journey</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Google Sign Up Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-border/50"
                            onClick={handleGoogleSignup}
                        >
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign up with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    {...register('name')}
                                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                                />
                                {errors.name && <p className="text-sm text-destructive animate-fade-in">{errors.name.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register('email')}
                                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                                />
                                {errors.email && <p className="text-sm text-destructive animate-fade-in">{errors.email.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                                />
                                {errors.password && <p className="text-sm text-destructive animate-fade-in">{errors.password.message as string}</p>}
                                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </Button>
                        </form>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-6">
                    <p className="text-sm text-muted-foreground text-center w-full">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
