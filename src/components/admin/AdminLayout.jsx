import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiUser, FiCode, FiFolder, FiMessageSquare,
  FiSettings, FiLogOut, FiShare2, FiMenu, FiX, FiLayout
} from 'react-icons/fi';
import { useState } from 'react';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/admin/profile', icon: FiUser, label: 'Profile' },
    { path: '/admin/skills', icon: FiCode, label: 'Skills' },
    { path: '/admin/projects', icon: FiFolder, label: 'Projects' },
    { path: '/admin/social', icon: FiShare2, label: 'Social Links' },
    { path: '/admin/footer', icon: FiLayout, label: 'Footer' },
    { path: '/admin/messages', icon: FiMessageSquare, label: 'Messages' },
    { path: '/admin/theme', icon: FiSettings, label: 'Theme' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
              end={item.exact}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {children}
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminLayout;