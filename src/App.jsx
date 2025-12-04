import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import AdminFooterSettings from './pages/admin/FooterSettings';

// Admin Components
import ProtectedRoute from './components/admin/ProtectedRoute';

import './App.css';

function App() {
  // Theme is now handled by Navbar.jsx - no theme loading here

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
          <Route path="/admin/footer" element={<ProtectedRoute><AdminFooterSettings /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;