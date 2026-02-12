import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import JobDetails from '../pages/JobDetails';
import ResumeAnalyzer from '../pages/ResumeAnalyzer';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, token } = useAuth();
    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Public Route Wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, token } = useAuth();
    if (isAuthenticated || token) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <Landing />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="job/:id" element={<JobDetails />} />
                <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
