import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, updateJob, deleteJob } from '../services/jobs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { ArrowLeft, ExternalLink, Save, Trash2, Building, Calendar, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'Not Applied',
        applicationLink: '',
        notes: '',
        dateApplied: '',
    });

    const { data: jobsData, isLoading } = useQuery({
        queryKey: ['jobs'],
        queryFn: () => getJobs({}),
    });

    const job = jobsData?.data?.jobs?.find((j: any) => j._id === id);

    useEffect(() => {
        if (job) {
            setFormData({
                company: job.company || '',
                role: job.role || '',
                status: job.status || 'Not Applied',
                applicationLink: job.applicationLink || '',
                notes: job.notes || '',
                dateApplied: job.dateApplied ? new Date(job.dateApplied).toISOString().split('T')[0] : '',
            });
        }
    }, [job]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => updateJob(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobStats'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteJob(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobStats'] });
            navigate('/dashboard');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this job application?')) {
            deleteMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-pulse space-y-4 w-full max-w-2xl">
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                    <div className="h-64 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">Job not found</h3>
                <Button onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        'Not Applied': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        'Applied': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Ghosted': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
        'Interview': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        'Offer': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="hover:bg-accent transition-all duration-200"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <Button
                    variant="ghost"
                    onClick={handleDelete}
                    className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
            </div>

            <Card className="border-border/50 hover-lift">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-3xl mb-2">{job.role}</CardTitle>
                            <div className="flex items-center text-muted-foreground gap-2">
                                <Building className="h-4 w-4" />
                                <span className="text-lg">{job.company}</span>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[job.status] || statusColors['Not Applied']}`}>
                            {job.status}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Status Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-medium">Application Status</Label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

                        {/* Application Link */}
                        {formData.applicationLink && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" />
                                    Job Posting Link
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        value={formData.applicationLink}
                                        onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                                        placeholder="https://..."
                                        className="h-11 flex-1"
                                    />
                                    {formData.applicationLink && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.open(formData.applicationLink, '_blank')}
                                            className="h-11 transition-all duration-200 hover:scale-105"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Date Applied */}
                        <div className="space-y-2">
                            <Label htmlFor="dateApplied" className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Date Applied
                            </Label>
                            <Input
                                id="dateApplied"
                                type="date"
                                value={formData.dateApplied}
                                onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                                className="h-11"
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-medium">Notes & Details</Label>
                            <textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Add any notes about this application..."
                                className="flex min-h-[200px] w-full rounded-lg border border-border bg-input px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring resize-none"
                            />
                        </div>

                        {/* Company & Role (editable) */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                                <Input
                                    id="company"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                                <Input
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="w-full h-11 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {updateMutation.isPending ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </>
                            )}
                        </Button>

                        {updateMutation.isSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-sm text-emerald-400"
                            >
                                ✓ Changes saved successfully
                            </motion.div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
