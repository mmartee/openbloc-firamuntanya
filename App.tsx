import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/navigation/ProtectedRoute';
import { Role } from './types';

// Page Components
import AuthPage from './pages/AuthPage';
import BlocksPage from './pages/BlocksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import ManagePage from './pages/ManagePage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/" element={<ProtectedRoute><BlocksPage /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/manage" element={
                  // FIX: Used Role enum instead of strings to match the prop type for 'roles'.
                  <ProtectedRoute roles={[Role.Admin, Role.Arbiter]}>
                    <ManagePage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
