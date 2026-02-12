import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    Loader2,
    History,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Lightbulb,
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import type { HistoryItem } from "../types";

interface HistoryListProps {
    items: HistoryItem[];
    isLoading: boolean;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatFullDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getScoreColorClass(score: number): string {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-400";
    return "bg-red-500/10 text-red-400";
}

function getScoreBorderClass(score: number): string {
    if (score >= 80) return "border-emerald-500/30";
    if (score >= 60) return "border-yellow-500/30";
    return "border-red-500/30";
}

export function HistoryList({ items, isLoading }: HistoryListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            {/* Main History List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="glass-card border-white/5 overflow-hidden">
                    <CardHeader className="border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Analysis History
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Click on any analysis to see full details
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="px-3 py-1">
                                {items.length} Analyses
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : items.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {items.map((item, index) => (
                                    <div key={item._id}>
                                        {/* Collapsed Row */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-5 hover:bg-white/[0.02] transition-colors cursor-pointer ${expandedId === item._id ? "bg-white/[0.02]" : ""
                                                }`}
                                            onClick={() => toggleExpand(item._id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Score Circle */}
                                                <div className="relative flex-shrink-0">
                                                    <div
                                                        className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${getScoreColorClass(
                                                            item.matchScore
                                                        )}`}
                                                    >
                                                        {item.matchScore || 0}%
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-medium text-sm truncate">
                                                            {item.jobDescription?.substring(0, 50)}
                                                            {item.jobDescription?.length > 50 ? "..." : ""}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatDate(item.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                            {item.strengths?.length || 0} strengths
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3 text-red-500" />
                                                            {item.missingSkills?.length || 0} gaps
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="hidden sm:block w-24">
                                                    <Progress
                                                        value={item.matchScore || 0}
                                                        className="h-2"
                                                    />
                                                </div>

                                                {/* Expand/Collapse Icon */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-8 w-8"
                                                >
                                                    {expandedId === item._id ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {expandedId === item._id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <HistoryItemDetail item={item} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <History className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Analysis History
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Your resume analysis history will appear here. Start by
                                    analyzing your first resume!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

// Detailed view component for expanded history item
function HistoryItemDetail({ item }: { item: HistoryItem }) {
    return (
        <div className="px-6 pb-8 pt-4 bg-white/[0.015] border-t border-white/5">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left: Score & Job Description */}
                <div className="space-y-6">
                    {/* Large Score Display */}
                    <div
                        className={`p-8 rounded-2xl border ${getScoreBorderClass(
                            item.matchScore
                        )} bg-gradient-to-br from-white/[0.03] to-transparent shadow-inner`}
                    >
                        <div className="text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                                MATCH SCORE
                            </p>
                            <div
                                className={`text-6xl font-black tracking-tighter ${item.matchScore >= 80
                                    ? "text-emerald-400"
                                    : item.matchScore >= 60
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                    }`}
                            >
                                {item.matchScore}%
                            </div>
                            <Progress
                                value={item.matchScore}
                                className="h-2 mt-6 bg-white/5"
                            />
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                            TARGET CONTEXT
                        </p>
                        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                            <p className="text-sm text-muted-foreground/80 leading-relaxed">
                                {item.jobDescription}
                            </p>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {formatFullDate(item.createdAt)}
                    </div>
                </div>

                {/* Middle: Strengths & Gaps */}
                <div className="space-y-6">
                    {/* Strengths */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                                Strengths ({item.strengths?.length || 0})
                            </p>
                        </div>
                        <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] min-h-[140px]">
                            {item.strengths?.length ? (
                                <div className="flex flex-wrap gap-2.5">
                                    {item.strengths.map((skill, i) => (
                                        <Badge
                                            key={i}
                                            variant="outline"
                                            className="bg-emerald-500/5 border-emerald-500/10 text-emerald-300/90 py-1 px-3 text-[11px] h-auto whitespace-normal text-left"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground/50 italic">
                                    No strengths identified
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Gaps */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            </div>
                            <p className="text-sm font-bold text-red-400 uppercase tracking-wider">
                                Skill Gaps ({item.missingSkills?.length || 0})
                            </p>
                        </div>
                        <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/[0.02] min-h-[140px]">
                            {item.missingSkills?.length ? (
                                <div className="flex flex-wrap gap-2.5">
                                    {item.missingSkills.map((skill, i) => (
                                        <Badge
                                            key={i}
                                            variant="outline"
                                            className="bg-red-500/5 border-red-500/10 text-red-300/90 py-1 px-3 text-[11px] h-auto whitespace-normal text-left"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground/50 italic">
                                    No gaps found 🎉
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Recommendations */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                        </div>
                        <p className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            AI Recommendations ({item.suggestions?.length || 0})
                        </p>
                    </div>
                    <div className="p-2 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.02] min-h-[300px] max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                        {item.suggestions?.length ? (
                            <div className="space-y-2">
                                {item.suggestions.map((suggestion, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/5 hover:border-yellow-500/30 transition-colors"
                                    >
                                        <span className="text-yellow-500/40 font-mono text-[10px] font-bold mt-1 shrink-0">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <p className="text-[13px] text-muted-foreground/90 leading-relaxed font-medium">
                                            {suggestion}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground/50 italic p-4">
                                No recommendations available
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
