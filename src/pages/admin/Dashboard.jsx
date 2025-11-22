import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { FiCode, FiBriefcase, FiMail } from 'react-icons/fi'
import './Dashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState({ skills: 0, projects: 0, messages: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      const [skills, projects, messages] = await Promise.all([
        supabase.from('skills').select('*', { count: 'exact' }),
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('contact_messages').select('*', { count: 'exact' })
      ])
      setStats({ skills: skills.count || 0, projects: projects.count || 0, messages: messages.count || 0 })
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
