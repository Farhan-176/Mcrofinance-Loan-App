import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Dashboard from './pages/Dashboard';
import LoanApplicationPage from './pages/LoanApplicationPage';
import LoanDetailsPage from './pages/LoanDetailsPage';
import SlipPage from './pages/SlipPage';
import AdminPanel from './pages/AdminPanel';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loan/apply"
                element={
                  <ProtectedRoute>
                    <LoanApplicationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loan/:id"
                element={
                  <ProtectedRoute>
                    <LoanDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loan/:id/slip"
                element={
                  <ProtectedRoute>
                    <SlipPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
