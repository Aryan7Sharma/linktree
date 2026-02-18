import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PublicProfilePage } from '@/pages/PublicProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes — redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/admin" replace /> : <AuthPage type="login" />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/admin" replace /> : <AuthPage type="signup" />}
        />

        {/* Protected dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Public profile pages — must be last to avoid overriding other routes */}
        <Route path="/:username" element={<PublicProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
