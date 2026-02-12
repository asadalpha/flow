import { ArrowUpRight } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { JOB_CATEGORIES } from "../types";

interface JobSelectorProps {
    jobCategory: string;
    onJobCategoryChange: (category: string) => void;
    customJD: string;
    onCustomJDChange: (jd: string) => void;
    useCustomJD: boolean;
    onUseCustomJDToggle: () => void;
}

export function JobSelector({
    jobCategory,
    onJobCategoryChange,
    customJD,
    onCustomJDChange,
    useCustomJD,
    onUseCustomJDToggle,
}: JobSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">

                    Target Role
                </Label>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={onUseCustomJDToggle}
                >
                    {useCustomJD ? "Use preset" : "Custom JD"}
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {useCustomJD ? (
                    <motion.div
                        key="custom-jd"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Textarea
                            placeholder="Paste the complete job description here for a more accurate analysis..."
                            value={customJD}
                            onChange={(e) => onCustomJDChange(e.target.value)}
                            className="min-h-[140px] bg-white/[0.02] border-white/10 focus:border-primary/30 resize-none"
                        />
                        <p className="text-[10px] text-muted-foreground mt-2">
                            Tip: Include responsibilities, requirements, and skills for best
                            results
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preset-select"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Select value={jobCategory} onValueChange={onJobCategoryChange}>
                            <SelectTrigger className="w-full h-12 bg-white/[0.02] border-white/10 hover:bg-white/[0.04] focus:border-primary/30">
                                <SelectValue placeholder="Select your target role..." />
                            </SelectTrigger>
                            <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
                                {JOB_CATEGORIES.map((category) => (
                                    <SelectItem
                                        key={category.value}
                                        value={category.value}
                                        className="focus:bg-primary/10"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            <span>{category.label}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
