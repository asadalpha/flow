// Status color configurations for job applications
export const statusColors = {
  "Not Applied": {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
    shadow: "shadow-gray-500/10",
    gradient: "from-gray-500/20 to-gray-600/20",
  },
  Applied: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    shadow: "shadow-blue-500/10",
    gradient: "from-blue-500/20 to-blue-600/20",
  },
  Interview: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    shadow: "shadow-amber-500/10",
    gradient: "from-amber-500/20 to-amber-600/20",
  },
  Offer: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    shadow: "shadow-emerald-500/10",
    gradient: "from-emerald-500/20 to-emerald-600/20",
  },
  Rejected: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    shadow: "shadow-red-500/10",
    gradient: "from-red-500/20 to-red-600/20",
  },
  Ghosted: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    shadow: "shadow-purple-500/10",
    gradient: "from-purple-500/20 to-purple-600/20",
  },
} as const;

export type JobStatus = keyof typeof statusColors;

export const getStatusColor = (status: string) => {
  return statusColors[status as JobStatus] || statusColors["Not Applied"];
};
