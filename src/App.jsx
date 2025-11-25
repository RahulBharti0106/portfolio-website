import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import AdminSkills from './pages/admin/Skills';
import AdminProjects from './pages/admin/Projects';
import AdminMessages from './pages/admin/Messages';
import AdminTheme from './pages/admin/Theme';
import AdminSocial from './pages/admin/Social';

// Admin Components
import ProtectedRoute from './components/admin/ProtectedRoute';

import './App.css';

function App() {
  // Load theme from Supabase on app startup
  useEffect(() => {
    async function loadTheme() {
      try {
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .eq('is_active', true)
          .single();

        if (!error && data) {
          // Apply theme as CSS variables
          document.documentElement.style.setProperty('--bg-primary', data.primary_color || '#ffffff');
          document.documentElement.style.setProperty('--bg-secondary', data.secondary_color || '#f8f9fa');
          document.documentElement.style.setProperty('--font-family', data.font_family || 'inherit');
          document.documentElement.style.setProperty('--font-size-base', (data.font_size || 16) + 'px');
        }
      } catch (err) {
        console.error('Failed to load theme:', err);
      }
    }
    loadTheme();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
          <Route path="/admin/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/theme" element={<ProtectedRoute><AdminTheme /></ProtectedRoute>} />
          <Route path="/admin/social" element={<ProtectedRoute><AdminSocial /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
