// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { FiCode, FiBriefcase, FiMail } from 'react-icons/fi'
import './Dashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState({ skills: 0, projects: 0, messages: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all three in parallel
        const [skills, projects, messages] = await Promise.all([
          api.adminGetSkills(),
          api.adminGetProjects(),
          api.getMessages(),
        ])
        setStats({
          skills: skills.length || 0,
          projects: projects.length || 0,
          messages: messages.length || 0,
        })
      } catch (err) {
        console.error('Dashboard stats error:', err)
      }
    }
    fetchStats()
  }, [])

  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <FiCode size={32} />
            <h3>{stats.skills}</h3>
            <p>Skills</p>
          </div>
          <div className="stat-card">
            <FiBriefcase size={32} />
            <h3>{stats.projects}</h3>
            <p>Projects</p>
          </div>
          <div className="stat-card">
            <FiMail size={32} />
            <h3>{stats.messages}</h3>
            <p>Messages</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard