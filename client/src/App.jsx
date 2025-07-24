import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import AuthPage from './pages/AuthPage'; 
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/auth" element={<AuthPage />} /> 
          <Route path="/dashboard" element={<DashboardPage />} /> 
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;