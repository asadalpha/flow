import { useQuery } from '@tanstack/react-query';
import { getJobs, getJobStats } from '../services/jobs';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { TrendingUp, Clock, Briefcase, Plus, CheckCircle, XCircle, MessageSquare, Star } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '../services/jobs';
import { useToast } from '../hooks/use-toast';

export default function KanbanView() {
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: jobsData, isLoading } = useQuery({
        queryKey: ['jobs'],
        queryFn: () => getJobs({})
    });

    const { data: statsData } = useQuery({
        queryKey: ['jobStats'],
        queryFn: getJobStats
    });

    const createMutation = useMutation({
        mutationFn: createJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobStats'] });
            setShowForm(false);
            reset();
            toast({
                variant: 'success',
                title: 'Application Added!',
                description: 'Job application has been successfully added.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Failed to Add',
                description: error.response?.data?.message || 'Could not add job application.',
            });
        },
    });

    const onSubmit = (data: any) => {
        createMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-pulse space-y-4 w-full max-w-4xl">
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                    <div className="grid gap-4 md:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statIcons = [TrendingUp, CheckCircle, Clock, Briefcase, XCircle, MessageSquare, Star];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-wrap gap-3 justify-between items-start">
                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-amber-400/70 mb-1">Board</p>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight premium-gradient-text">Pipeline Board</h2>
                    <p className="text-sm text-muted-foreground mt-1">Visualize and manage your job applications</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="h-10 px-5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #f9bb30, #f59e0b)', color: '#0a0a0a', boxShadow: '0 4px 20px rgba(249,187,48,0.3)' }}
                >
                    <Plus className="mr-1.5 h-4 w-4" /> New Application
                </Button>
            </div>

            {/* Stats */}
            {statsData?.data?.stats && statsData.data.stats.length > 0 && (
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    {statsData.data.stats.map((stat: any, index: number) => {
                        const Icon = statIcons[index % statIcons.length];
                        return (
                            <Card
                                key={stat._id}
                                className="glass-card hover-lift border-0 overflow-hidden group relative cursor-default amber-top-glow animate-fade-up"
                                style={{ animationDelay: `${index * 70}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4 relative z-10">
                                    <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {stat._id}
                                    </CardTitle>
                                    <div className="w-8 h-8 rounded-lg bg-amber-400/8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-amber-400/10">
                                        <Icon className="h-4 w-4 text-amber-400/70" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4 px-4 relative z-10">
                                    <div className="text-3xl font-heading font-bold amber-gradient-text">{stat.count}</div>
                                    <p className="text-[11px] text-muted-foreground mt-1">Applications</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add Job Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-125">
                    <DialogHeader>
                        <DialogTitle>Add New Application</DialogTitle>
                        <DialogDescription>Track a new job application in your pipeline.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company *</Label>
                            <Input
                                id="company"
                                placeholder="e.g., Google"
                                {...register('company', { required: true })}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Input
                                id="role"
                                placeholder="e.g., Software Engineer"
                                {...register('role', { required: true })}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Brief job description..."
                                {...register('description')}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="applicationLink">Application Link</Label>
                            <Input
                                id="applicationLink"
                                type="url"
                                placeholder="https://..."
                                {...register('applicationLink')}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                placeholder="Add any notes about this application..."
                                {...register('notes')}
                                className="flex min-h-25 w-full rounded-lg border border-border bg-input px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring resize-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowForm(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {createMutation.isPending ? 'Saving...' : 'Save Application'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Kanban Board */}
            {jobsData?.data?.jobs?.length > 0 ? (
                <div>
                    <KanbanBoard jobs={jobsData.data.jobs} />
                </div>
            ) : (
                <div className="text-center py-20 animate-fade-up">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center border border-amber-400/15"
                         style={{ background: 'linear-gradient(135deg, rgba(249,187,48,0.08), rgba(0,0,0,0.3))' }}>
                        <Briefcase className="h-8 w-8 text-amber-400/40" />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground text-sm mb-6">Start tracking your job applications</p>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="h-10 px-5 font-semibold rounded-xl"
                        style={{ background: 'linear-gradient(135deg,#f9bb30,#f59e0b)', color: '#0a0a0a' }}
                    >
                        <Plus className="mr-1.5 h-4 w-4" /> Add Your First Application
                    </Button>
                </div>
            )}
        </div>
    );
}
