import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Trash2, Calendar, FileText, GripVertical } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJob, deleteJob } from '../services/jobs';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Job {
    _id: string;
    company: string;
    role: string;
    status: string;
    dateApplied: string;
    applicationLink?: string;
    description?: string;
    notes?: string;
}

interface KanbanBoardProps {
    jobs: Job[];
}

const statuses = [
    { id: 'Not Applied', label: 'Not Applied', color: 'from-gray-500/20 to-gray-600/20', borderColor: 'border-gray-500/30', textColor: 'text-gray-400' },
    { id: 'Applied', label: 'Applied', color: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-500/30', textColor: 'text-blue-400' },
    { id: 'Interview', label: 'Interview', color: 'from-amber-500/20 to-amber-600/20', borderColor: 'border-amber-500/30', textColor: 'text-amber-400' },
];

export default function KanbanBoard({ jobs }: KanbanBoardProps) {
    const [draggedJob, setDraggedJob] = useState<Job | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateJob(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobStats'] });
            toast({
                variant: 'success',
                title: 'Status Updated',
                description: 'Job status has been updated successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.response?.data?.message || 'Could not update job status.',
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

    const handleDragStart = (e: React.DragEvent, job: Job) => {
        setDraggedJob(job);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(status);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);

        if (draggedJob && draggedJob.status !== newStatus) {
            updateMutation.mutate({
                id: draggedJob._id,
                data: { status: newStatus },
            });
        }
        setDraggedJob(null);
    };

    const getJobsByStatus = (status: string) => {
        return jobs.filter((job) => job.status === status);
    };

    const handleDelete = (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        if (window.confirm('Delete this application?')) {
            deleteMutation.mutate(jobId);
        }
    };

    return (
        <div className="flex gap-4 pb-4">
            {statuses.map((status) => {
                const columnJobs = getJobsByStatus(status.id);
                const isDragOver = dragOverColumn === status.id;

                return (
                    <div
                        key={status.id}
                        className="flex-1 min-w-[300px]"
                        onDragOver={(e) => handleDragOver(e, status.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, status.id)}
                    >
                        {/* Column Header */}
                        <div className={`mb-4 rounded-xl bg-linear-to-br ${status.color} border ${status.borderColor} p-4 backdrop-blur-sm transition-all duration-300 ${isDragOver ? 'ring-2 ring-white/30 scale-105 shadow-xl' : ''
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-bold text-lg ${status.textColor}`}>
                                        {status.label}
                                    </h3>
                                </div>
                                <span className={`${status.textColor} font-semibold text-sm bg-white/10 px-3 py-1 rounded-full`}>
                                    {columnJobs.length}
                                </span>
                            </div>
                        </div>

                        {/* Cards Container */}
                        <div className={`space-y-3 min-h-50 rounded-xl transition-all duration-300 p-2 ${isDragOver ? 'bg-white/5 border-2 border-dashed border-white/30' : ''
                            }`}>
                            <AnimatePresence>
                                {columnJobs.map((job, index) => (
                                    <motion.div
                                        key={job._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e as any, job)}
                                        onDragEnd={() => setDraggedJob(null)}
                                        className={`cursor-move ${draggedJob?._id === job._id ? 'opacity-50' : ''}`}
                                    >
                                        <Card
                                            className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 group"
                                            onClick={() => navigate(`/job/${job._id}`)}
                                        >
                                            <div className="p-4 space-y-3">
                                                {/* Drag Handle */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                                {job.company}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground font-medium">
                                                            {job.role}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Description Preview */}
                                                {job.description && (
                                                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                                        <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                                                        <p className="line-clamp-2">{job.description}</p>
                                                    </div>
                                                )}

                                                {/* Date */}
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(job.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {job.applicationLink && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 text-xs hover:bg-white/10 flex-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(job.applicationLink, '_blank');
                                                            }}
                                                        >
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            Open
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs hover:bg-destructive/20 hover:text-destructive"
                                                        onClick={(e) => handleDelete(e, job._id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Empty State */}
                            {columnJobs.length === 0 && !isDragOver && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    <div className="opacity-50">No applications</div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
