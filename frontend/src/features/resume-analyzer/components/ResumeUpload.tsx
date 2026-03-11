import { FileText, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../hooks/use-toast";

interface ResumeUploadProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
}

export function ResumeUpload({ file, onFileChange }: ResumeUploadProps) {
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            onFileChange(selectedFile);
            toast({
                title: "File Selected",
                description: `${selectedFile.name} is ready for analysis.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Invalid File",
                description: "Please upload a PDF file.",
            });
        }
    };

    return (
        <div className="group/upload relative">
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
            />
            <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center min-h-[160px] w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm transition-all duration-300 group-hover/upload:border-primary/50 group-hover/upload:bg-white/[0.04] cursor-pointer"
            >
                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                <CheckCircle className="w-7 h-7 text-emerald-400" />
                            </div>
                            <p className="font-semibold text-foreground text-base">
                                {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3 text-xs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onFileChange(null);
                                }}
                            >
                                Change file
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-file"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5 group-hover/upload:scale-110 transition-transform duration-300">
                                <FileText className="w-7 h-7 text-muted-foreground" />
                            </div>
                            <p className="font-medium text-foreground">
                                Drop your resume here
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                PDF format • Max 5MB
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </label>
        </div>
    );
}
