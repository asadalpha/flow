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
import { Plus, Trash2, Briefcase, TrendingUp, Clock, ExternalLink, CheckCircle, XCircle, MessageSquare, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '../hooks/use-toast';

const STATUS_COLORS: Record<string, string> = {
    'Offer':      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Rejected':   'bg-red-500/10 text-red-400 border-red-500/20',
    'Interview':  'bg-amber-400/10 text-amber-400 border-amber-400/25',
    'Ghosted':    'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Applied':    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Not Applied':'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const STAT_ICONS = [TrendingUp, CheckCircle, Clock, Briefcase, XCircle, MessageSquare, Star];

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
            toast({ variant: 'success', title: 'Application Added!', description: 'Job application has been successfully added.' });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: 'Failed to Add', description: error.response?.data?.message || 'Could not add job application.' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobStats'] });
            toast({ variant: 'success', title: 'Application Deleted', description: 'Job application has been removed.' });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: 'Failed to Delete', description: error.response?.data?.message || 'Could not delete job application.' });
        },
    });

    const onSubmit = (data: any) => createMutation.mutate(data);

    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="h-10 w-48 skeleton rounded-xl" />
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
                </div>
                <div className="h-72 skeleton rounded-2xl" />
            </div>
        );
    }

    const jobs = jobsData?.data?.jobs ?? [];
    const stats = statsData?.data?.stats ?? [];

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── Page Header ── */}
            <div className="flex flex-wrap gap-3 justify-between items-start">
                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-amber-400/70 mb-1">Overview</p>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight premium-gradient-text">
                        Job Applications
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Track and manage your career journey</p>
                </div>
                <Button
                    onClick={() => setShowForm(true)}
                    className="h-10 px-5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                    style={{
                        background: 'linear-gradient(135deg, #f9bb30, #f59e0b)',
                        color: '#0a0a0a',
                        boxShadow: '0 4px 20px rgba(249,187,48,0.3)',
                    }}
                >
                    <Plus className="mr-1.5 h-4 w-4" /> New Application
                </Button>
            </div>

            {/* ── Stats Grid ── */}
            {stats.length > 0 && (
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    {stats.map((stat: any, index: number) => {
                        const Icon = STAT_ICONS[index % STAT_ICONS.length];
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
                                    <p className="text-[11px] text-muted-foreground mt-1">applications</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ── Add Job Modal ── */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-[480px] glass-card border border-white/8">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent rounded-t-xl" />
                    <DialogHeader>
                        <DialogTitle className="font-heading text-lg">Add New Application</DialogTitle>
                        <DialogDescription>Track a new job application by filling in the details below.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company *</Label>
                            <Input id="company" placeholder="e.g., Google" {...register('company', { required: true })} className="h-10" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role *</Label>
                            <Input id="role" placeholder="e.g., Software Engineer" {...register('role', { required: true })} className="h-10" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
                            <select
                                id="status"
                                {...register('status')}
                                className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 cursor-pointer"
                            >
                                <option value="Not Applied">Not Applied</option>
                                <option value="Applied">Applied</option>
                                <option value="Ghosted">Ghosted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="applicationLink" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Link</Label>
                            <Input id="applicationLink" type="url" placeholder="https://..." {...register('applicationLink')} className="h-10" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
                            <textarea
                                id="notes"
                                placeholder="Add any notes..."
                                {...register('notes')}
                                className="flex min-h-[90px] w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 resize-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 h-10 border-white/10">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="flex-1 h-10 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg,#f9bb30,#f59e0b)', color: '#0a0a0a' }}
                            >
                                {createMutation.isPending ? 'Saving...' : 'Save Application'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Jobs Table ── */}
            {jobs.length > 0 ? (
                <Card className="glass-card border-0 shadow-2xl overflow-hidden rounded-2xl relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-5">Company</TableHead>
                                    <TableHead className="font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Role</TableHead>
                                    <TableHead className="font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Date</TableHead>
                                    <TableHead className="text-right font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-widest pr-5">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job: any, idx: number) => (
                                    <TableRow
                                        key={job._id}
                                        className="cursor-pointer hover:bg-amber-400/[0.03] transition-colors border-white/[0.04] group animate-fade-in"
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                        onClick={() => navigate(`/job/${job._id}`)}
                                    >
                                        <TableCell className="font-semibold text-foreground whitespace-nowrap pl-5">{job.company}</TableCell>
                                        <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">{job.role}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_COLORS[job.status] ?? STATUS_COLORS['Not Applied']}`}>
                                                {job.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap hidden sm:table-cell">
                                            {new Date(job.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-right pr-5">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:opacity-0 opacity-100">
                                                {job.applicationLink && (
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="h-7 w-7 hover:bg-white/10 rounded-lg"
                                                        onClick={(e) => { e.stopPropagation(); window.open(job.applicationLink, '_blank'); }}
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-7 w-7 hover:bg-red-500/15 hover:text-red-400 rounded-lg"
                                                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this application?')) deleteMutation.mutate(job._id); }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            ) : (
                /* ── Empty State ── */
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
