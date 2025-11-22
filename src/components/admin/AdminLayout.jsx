import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiHome, FiUser, FiCode, FiBriefcase, FiMail, FiSettings, FiLink, FiLogOut } from 'react-icons/fi'
import './AdminLayout.css'

function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out')
      navigate('/admin/login')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/profile', icon: FiUser, label: 'Profile' },
    { path: '/admin/skills', icon: FiCode, label: 'Skills' },
    { path: '/admin/projects', icon: FiBriefcase, label: 'Projects' },
    { path: '/admin/messages', icon: FiMail, label: 'Messages' },
    { path: '/admin/theme', icon: FiSettings, label: 'Theme' },
    { path: '/admin/social', icon: FiLink, label: 'Social' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header"><h2>Admin Panel</h2></div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <item.icon size={20} /><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="logout-btn"><FiLogOut size={20} /><span>Logout</span></button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}

export default AdminLayout
