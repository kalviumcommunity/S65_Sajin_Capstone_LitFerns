import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import BookDetailsPage from './pages/BookDetailsPage';
import SwapDashboardPage from './pages/SwapDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><SwapDashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
