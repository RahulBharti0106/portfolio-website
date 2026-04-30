// src/pages/admin/Theme.jsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../lib/api'
import toast from 'react-hot-toast'
import './Theme.css'

function AdminTheme() {
  const [theme, setTheme] = useState({
    dark_bg_primary: '#0a0a0a', dark_bg_secondary: '#1a1a1a',
    dark_accent: '#6366f1', dark_text_primary: '#ffffff', dark_text_secondary: '#9ca3af',
    light_bg_primary: '#ffffff', light_bg_secondary: '#f3f4f6',
    light_accent: '#6366f1', light_text_primary: '#111827', light_text_secondary: '#4b5563'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await api.getTheme()
        if (data) setTheme(data)
      } catch (err) {
        toast.error('Failed to load theme')
      } finally {
        setLoading(false)
      }
    }
    fetchTheme()
  }, [])

  const handleChange = (field, value) => {
    setTheme(prev => ({ ...prev, [field]: value }))
  }

  const publishTheme = async () => {
    setSaving(true)
    try {
      await api.updateTheme(theme)
      toast.success('✅ Theme published! Refresh the main website to see changes.')
    } catch (err) {
      toast.error('Failed to publish theme: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AdminLayout><div style={{ textAlign: 'center', padding: '3rem' }}>Loading theme...</div></AdminLayout>

  const ColorInput = ({ label, field }) => (
    <div className="color-input-group">
      <label>{label}</label>
      <div className="color-input">
        <input type="color" value={theme[field]} onChange={(e) => handleChange(field, e.target.value)} />
        <input type="text" value={theme[field]} onChange={(e) => handleChange(field, e.target.value)} />
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="theme-customizer">
        <h1>Theme Customizer</h1>
        <p className="subtitle">Customize colors for both Dark and Light modes</p>

        <div className="theme-grid">
          <div className="theme-section">
            <h2>🌙 Dark Mode Colors</h2>
            <ColorInput label="Background Primary" field="dark_bg_primary" />
            <ColorInput label="Background Secondary" field="dark_bg_secondary" />
            <ColorInput label="Accent Color" field="dark_accent" />
            <ColorInput label="Text Primary" field="dark_text_primary" />
            <ColorInput label="Text Secondary" field="dark_text_secondary" />
          </div>

          <div className="theme-section">
            <h2>☀️ Light Mode Colors</h2>
            <ColorInput label="Background Primary" field="light_bg_primary" />
            <ColorInput label="Background Secondary" field="light_bg_secondary" />
            <ColorInput label="Accent Color" field="light_accent" />
            <ColorInput label="Text Primary" field="light_text_primary" />
            <ColorInput label="Text Secondary" field="light_text_secondary" />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={publishTheme}
          disabled={saving}
          style={{ marginTop: '2rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {saving ? '⏳ Publishing...' : '🚀 Publish Theme to Main Website'}
        </button>
      </div>
    </AdminLayout>
  )
}

export default AdminTheme