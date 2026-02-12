import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import type { AnalysisResult } from "../types";

interface AnalysisResultsProps {
    result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
    return (
        <div className="space-y-6">
            {/* Strengths & Gaps */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Strengths */}
                <Card className="glass-card border border-emerald-500/20 bg-emerald-500/[0.02]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 text-emerald-400">
                            <CheckCircle className="w-4 h-4" />
                            Strengths
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {result.strengths?.length ? (
                            <div className="flex flex-wrap gap-2.5">
                                {result.strengths.map((skill, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="bg-emerald-500/5 text-emerald-300/90 border-emerald-500/10 py-1 px-3 text-[11px] h-auto whitespace-normal text-left"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground/50 italic">
                                No strengths detected
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Gaps */}
                <Card className="glass-card border border-red-500/20 bg-red-500/[0.02]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            Skill Gaps
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {result.missingSkills?.length ? (
                            <div className="flex flex-wrap gap-2.5">
                                {result.missingSkills.map((skill, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="bg-red-500/5 text-red-300/90 border-red-500/10 py-1 px-3 text-[11px] h-auto whitespace-normal text-left"
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
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations */}
            <Card className="glass-card border border-yellow-500/20 bg-yellow-500/[0.02]">
                <CardHeader className="pb-4 border-b border-white/5">
                    <CardTitle className="text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 text-yellow-400">
                        <Lightbulb className="w-4 h-4" />
                        AI Recommendations
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {result.suggestions?.length ? (
                            result.suggestions.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="flex gap-5 px-6 py-5 hover:bg-white/[0.02] transition-colors"
                                >
                                    <span className="text-yellow-500/40 font-mono text-[10px] font-bold mt-1">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <p className="text-[13px] text-muted-foreground/90 leading-relaxed font-medium">
                                        {item}
                                    </p>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-6">
                                <p className="text-xs text-muted-foreground/50 italic text-center">
                                    No recommendations available
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
