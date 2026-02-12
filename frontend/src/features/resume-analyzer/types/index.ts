// Resume Analyzer Types

export interface AnalysisResult {
    matchScore: number;
    strengths?: string[];
    missingSkills?: string[];
    suggestions?: string[];
}

export interface HistoryItem {
    _id: string;
    createdAt: string;
    jobDescription: string;
    matchScore: number;
    strengths?: string[];
    missingSkills?: string[];
    suggestions?: string[];
}

export interface JobCategory {
    value: string;
    label: string;
    icon: string;
}

export const JOB_CATEGORIES: JobCategory[] = [
    { value: "software-engineer", label: "Software Engineer", icon: "💻" },
    { value: "data-scientist", label: "Data Scientist", icon: "📊" },
    { value: "product-manager", label: "Product Manager", icon: "📦" },
    { value: "ui-ux-designer", label: "UI/UX Designer", icon: "🎨" },
    { value: "devops-engineer", label: "DevOps Engineer", icon: "⚙️" },
    { value: "ml-engineer", label: "ML Engineer", icon: "🤖" },
    { value: "frontend-developer", label: "Frontend Developer", icon: "🖥️" },
    { value: "backend-developer", label: "Backend Developer", icon: "🔧" },
    { value: "general", label: "General", icon: "📄" },
];
