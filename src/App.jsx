import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Home from './pages/Home'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProfile from './pages/admin/Profile'
import AdminSkills from './pages/admin/Skills'
import AdminProjects from './pages/admin/Projects'
import AdminMessages from './pages/admin/Messages'
import AdminTheme from './pages/admin/Theme'
import AdminSocial from './pages/admin/Social'

import ProtectedRoute from './components/admin/ProtectedRoute'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home darkMode={darkMode} toggleTheme={toggleTheme} />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
      <Route path="/admin/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
      <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
      <Route path="/admin/theme" element={<ProtectedRoute><AdminTheme /></ProtectedRoute>} />
      <Route path="/admin/social" element={<ProtectedRoute><AdminSocial /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
