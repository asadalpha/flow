import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analyzeResume, getAnalyses } from "../../../services/resume";
import { useToast } from "../../../hooks/use-toast";
import type { AnalysisResult, HistoryItem } from "../types";

interface AnalyzeResumeParams {
    resumeFile: File;
    jobDescription: string;
}

export function useResumeAnalysis() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch analysis history
    const historyQuery = useQuery({
        queryKey: ["resumeHistory"],
        queryFn: getAnalyses,
    });

    // Analyze resume mutation
    const analyzeMutation = useMutation({
        mutationFn: analyzeResume,
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Analysis Complete!",
                description: "Your resume has been successfully analyzed.",
            });
            queryClient.invalidateQueries({ queryKey: ["resumeHistory"] });
        },
        onError: (error: any) => {
            if (error.response?.status === 403) {
                toast({
                    variant: "destructive",
                    title: "Analysis Limit",
                    description: "You've reached your limit of 1 analysis per account. More tries coming soon!",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Analysis Failed",
                    description:
                        error.response?.data?.message ||
                        "Failed to analyze resume. Please try again.",
                });
            }
        },
    });

    const analyze = (params: AnalyzeResumeParams) => {
        analyzeMutation.mutate(params);
    };

    const result = analyzeMutation.data?.data?.analysis as AnalysisResult | undefined;
    const analysisHistory = (historyQuery.data?.data?.analyses || []) as HistoryItem[];

    return {
        // Analysis
        analyze,
        isAnalyzing: analyzeMutation.isPending,
        result,

        // History
        history: analysisHistory,
        isLoadingHistory: historyQuery.isLoading,
        refetchHistory: historyQuery.refetch,
    };
}
