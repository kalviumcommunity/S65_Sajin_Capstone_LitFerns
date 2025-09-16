import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import BookDetailsPage from './pages/BookDetailsPage';
import SwapDashboardPage from './pages/SwapDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
        <Route path="/dashboard" element={<SwapDashboardPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
