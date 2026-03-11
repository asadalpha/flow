import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Lightbulb, Loader2, Target, History, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";

// Feature imports - clean modular architecture
import {
  ResumeUpload,
  JobSelector,
  ScoreDisplay,
  AnalysisResults,
  HistoryList,
  useResumeAnalysis,
} from "../features/resume-analyzer";

export default function ResumeAnalyzer() {
  // Local UI state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobCategory, setJobCategory] = useState("");
  const [customJD, setCustomJD] = useState("");
  const [useCustomJD, setUseCustomJD] = useState(false);

  const { toast } = useToast();

  // Custom hook handles all data fetching and mutations
  const { analyze, isAnalyzing, result, history, isLoadingHistory } = useResumeAnalysis();

  const handleAnalyze = () => {
    if (!resumeFile) {
      toast({
        variant: "warning",
        title: "Missing Resume",
        description: "Please upload a PDF resume.",
      });
      return;
    }

    if (!useCustomJD && !jobCategory) {
      toast({
        variant: "warning",
        title: "Missing Job Category",
        description: "Please select a target role or enter a custom JD.",
      });
      return;
    }

    if (useCustomJD && !customJD.trim()) {
      toast({
        variant: "warning",
        title: "Missing Job Description",
        description: "Please enter a job description.",
      });
      return;
    }

    const jobDescription = useCustomJD
      ? customJD
      : `Job Category: ${jobCategory}`;

    analyze({ resumeFile, jobDescription });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <PageHeader />

      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50">
          <TabsTrigger value="analyze" className="gap-2">
            <Target className="w-4 h-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="mt-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Upload & Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <UploadCard
                resumeFile={resumeFile}
                onFileChange={setResumeFile}
                jobCategory={jobCategory}
                onJobCategoryChange={setJobCategory}
                customJD={customJD}
                onCustomJDChange={setCustomJD}
                useCustomJD={useCustomJD}
                onUseCustomJDToggle={() => setUseCustomJD(!useCustomJD)}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />

              {/* Quick Tips Card */}
              <QuickTipsCard />
            </motion.div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <ScoreDisplay score={result.matchScore} />
                    <AnalysisResults result={result} />
                  </motion.div>
                ) : (
                  <EmptyState key="empty-state" />
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <HistoryList items={history} isLoading={isLoadingHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// Sub-components (can be extracted to separate files if needed)
// ============================================================================

function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-lg">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-gradient-text">
            Resume Insight
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered resume analysis & job matching
          </p>
        </div>
      </div>

      <Badge variant="outline" className="px-3 py-1.5 gap-2 text-xs">
        <Zap className="w-3 h-3 text-yellow-500" />
        Powered by AI
      </Badge>
    </div>
  );
}

interface UploadCardProps {
  resumeFile: File | null;
  onFileChange: (file: File | null) => void;
  jobCategory: string;
  onJobCategoryChange: (category: string) => void;
  customJD: string;
  onCustomJDChange: (jd: string) => void;
  useCustomJD: boolean;
  onUseCustomJDToggle: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

function UploadCard({
  resumeFile,
  onFileChange,
  jobCategory,
  onJobCategoryChange,
  customJD,
  onCustomJDChange,
  useCustomJD,
  onUseCustomJDToggle,
  onAnalyze,
  isAnalyzing,
}: UploadCardProps) {
  return (
    <Card className="glass-card border-white/5 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Upload Resume
        </CardTitle>
        <CardDescription>
          Drop your PDF resume for AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResumeUpload file={resumeFile} onFileChange={onFileChange} />

        <Separator className="bg-white/5" />

        <JobSelector
          jobCategory={jobCategory}
          onJobCategoryChange={onJobCategoryChange}
          customJD={customJD}
          onCustomJDChange={onCustomJDChange}
          useCustomJD={useCustomJD}
          onUseCustomJDToggle={onUseCustomJDToggle}
        />

        {/* Analyze Button */}
        <Button
          className="w-full h-12 font-bold transition-all duration-300 bg-primary text-primary-foreground hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-xl group overflow-hidden relative"
          onClick={onAnalyze}
          disabled={isAnalyzing}
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing Resume...</span>
              </>
            ) : (
              <>
                <span>Start Deep Analysis</span>
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              </>
            )}
          </div>
          {isAnalyzing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
            />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickTipsCard() {
  return (
    <Card className="glass-card border-white/5 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Pro Tip</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For the most accurate analysis, paste the complete job
              description including requirements, responsibilities, and desired
              skills.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full min-h-[500px] flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl p-12 bg-white/[0.01]"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center mb-6 border border-white/5">
        <Sparkles className="w-10 h-10 text-muted-foreground/30" />
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">
        Ready for Insights
      </h3>
      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
        Upload your resume and choose a target role to see how you stack up
        against the competition.
      </p>
    </motion.div>
  );
}
