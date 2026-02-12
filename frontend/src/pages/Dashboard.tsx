import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob, deleteJob, getJobStats } from '../services/jobs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Trash2, Briefcase, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '../hooks/use-toast';

export default function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const { toast } = useToast();

    const { data: jobsData, isLoading } = useQuery({ queryKey: ['jobs'], queryFn: () => getJobs({}) });
    const { data: statsData } = useQuery({ queryKey: ['jobStats'], queryFn: getJobStats });

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

    const deleteMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobStats'] });
            toast({
                variant: 'success',
                title: 'Application Deleted',
                description: 'Job application has been removed.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Failed to Delete',
                description: error.response?.data?.message || 'Could not delete job application.',
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

    const statIcons = [TrendingUp, Clock, Briefcase, TrendingUp];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-gradient-to-r from-transparent via-white/[0.02] to-transparent p-4 -mx-4 rounded-xl">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2 premium-gradient-text">Job Applications</h2>
                    <p className="text-muted-foreground text-lg">Track and manage your career journey with precision</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="transition-all duration-300 hover:scale-105 active:scale-95 bg-primary text-primary-foreground shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-xl px-6 h-12 text-sm font-semibold tracking-wide"
                >
                    <Plus className="mr-2 h-5 w-5" /> New Application
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                {statsData?.data?.stats?.map((stat: any, index: number) => {
                    const Icon = statIcons[index % statIcons.length];
                    return (
                        <Card
                            key={stat._id}
                            className="glass-card hover-lift border-0 overflow-hidden group animate-fade-in relative"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    {stat._id}
                                </CardTitle>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-white/5 shadow-inner">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">{stat.count}</div>
                                <p className="text-xs text-muted-foreground mt-2 font-medium">applications</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add Job Modal */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Job Application</DialogTitle>
                        <DialogDescription>
                            Track a new job application by filling in the details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                {...register('status')}
                                className="flex h-11 w-full rounded-lg border border-border bg-input px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring cursor-pointer"
                            >
                                <option value="Not Applied">Not Applied</option>
                                <option value="Applied">Applied</option>
                                <option value="Ghosted">Ghosted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                            </select>
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
                                className="flex min-h-[100px] w-full rounded-lg border border-border bg-input px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring resize-none"
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

            {/* Jobs Table */}
            {jobsData?.data?.jobs?.length > 0 ? (
                <Card className="glass-card border-0 shadow-2xl overflow-hidden rounded-xl">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableHead className="w-[250px] font-semibold text-muted-foreground">Company</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Role</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Date Applied</TableHead>
                                <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobsData?.data?.jobs?.map((job: any) => {
                                const getStatusColor = (status: string) => {
                                    switch (status) {
                                        case 'Offer':
                                            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
                                        case 'Rejected':
                                            return 'bg-red-500/10 text-red-400 border-red-500/20';
                                        case 'Interview':
                                            return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
                                        case 'Ghosted':
                                            return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                                        case 'Applied':
                                            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                                        default:
                                            return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
                                    }
                                };

                                return (
                                    <TableRow
                                        key={job._id}
                                        className="cursor-pointer hover:bg-white/5 transition-colors border-white/5 group"
                                        onClick={() => navigate(`/job/${job._id}`)}
                                    >
                                        <TableCell className="font-semibold text-foreground">{job.company}</TableCell>
                                        <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors">{job.role}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(job.dateApplied).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {job.applicationLink && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-white/10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(job.applicationLink, '_blank');
                                                        }}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Delete this application?')) {
                                                            deleteMutation.mutate(job._id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <div className="text-center py-16 animate-fade-in">
                    <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-6">Start tracking your job applications</p>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Your First Application
                    </Button>
                </div>
            )}
        </div>
    );
}
