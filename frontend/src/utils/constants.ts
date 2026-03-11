// App Constants

export const APP_NAME = 'Flow';
export const APP_TAGLINE = 'Streamline Your Job Search';
export const APP_DESCRIPTION = 'Flow helps you track applications, analyze resumes, and land your dream job faster with AI-powered insights.';

// Navigation Links for Landing Page
export const NAV_LINKS = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
] as const;

// Feature Cards Data
export const FEATURES = [
    {
        id: 'track',
        title: 'Track Applications',
        description: 'Organize and monitor all your job applications in one beautiful dashboard.',
        icon: 'layout-dashboard',
    },
    {
        id: 'analyze',
        title: 'AI Resume Analysis',
        description: 'Get instant feedback and optimization suggestions powered by advanced AI.',
        icon: 'file-search',
    },
    {
        id: 'insights',
        title: 'Smart Insights',
        description: 'Understand patterns in your job search and improve your success rate.',
        icon: 'sparkles',
    },
    {
        id: 'organize',
        title: 'Stay Organized',
        description: 'Never miss a deadline with smart reminders and status updates.',
        icon: 'calendar-check',
    },
] as const;

// How It Works Steps
export const HOW_IT_WORKS_STEPS = [
    {
        step: 1,
        title: 'Sign Up',
        description: 'Create your free account in seconds.',
    },
    {
        step: 2,
        title: 'Add Applications',
        description: 'Track jobs you\'ve applied to with details.',
    },
    {
        step: 3,
        title: 'Analyze Resume',
        description: 'Get AI-powered insights to improve your resume.',
    },
    {
        step: 4,
        title: 'Land Your Job',
        description: 'Use insights to optimize and succeed.',
    },
] as const;

// Testimonials
export const TESTIMONIALS = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'Software Engineer',
        company: 'Tech Corp',
        content: 'Flow completely transformed my job search. The AI resume analyzer helped me land interviews at top companies.',
        avatar: 'SC',
    },
    {
        id: 2,
        name: 'Marcus Johnson',
        role: 'Product Designer',
        company: 'Design Studio',
        content: 'Finally, a job tracker that\'s actually beautiful to use. The interface is incredible and so intuitive.',
        avatar: 'MJ',
    },
    {
        id: 3,
        name: 'Emily Park',
        role: 'Data Scientist',
        company: 'Analytics Inc',
        content: 'The insights feature showed me patterns in my applications I never noticed. Highly recommended!',
        avatar: 'EP',
    },
] as const;

// Stats for Social Proof
export const STATS = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Jobs Tracked' },
    { value: '85%', label: 'Success Rate' },
] as const;
