import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import './Theme.css'

function AdminTheme() {
  const [colors, setColors] = useState({
    light: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      accent: '#6366f1',
      text: '#1a1a1a',
      textSecondary: '#6b7280'
    },
    dark: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      accent: '#6366f1',
      text: '#ffffff',
      textSecondary: '#9ca3af'
    }
  })

  const applyTheme = (mode) => {
    const theme = colors[mode]
    document.documentElement.style.setProperty('--bg-primary', theme.primary)
    document.documentElement.style.setProperty('--bg-secondary', theme.secondary)
    document.documentElement.style.setProperty('--bg-accent', theme.accent)
    document.documentElement.style.setProperty('--text-primary', theme.text)
    document.documentElement.style.setProperty('--text-secondary', theme.textSecondary)
  }

  const handleColorChange = (mode, key, value) => {
    setColors(prev => ({
      ...prev,
      [mode]: { ...prev[mode], [key]: value }
    }))
  }

  const saveTheme = () => {
    localStorage.setItem('customTheme', JSON.stringify(colors))
    toast.success('Theme saved!')
  }

  return (
    <AdminLayout>
      <div className="theme-customizer">
        <h1>Theme Customizer</h1>
        <p className="subtitle">Customize your portfolio colors</p>

        <div className="theme-grid">
          <div className="theme-section">
            <h2>Light Mode</h2>
            {Object.keys(colors.light).map((key) => (
              <div key={key} className="color-input-group">
                <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={colors.light[key]}
                    onChange={(e) => handleColorChange('light', key, e.target.value)}
                  />
                  <input
                    type="text"
                    value={colors.light[key]}
                    onChange={(e) => handleColorChange('light', key, e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button onClick={() => applyTheme('light')} className="btn btn-outline">Preview Light</button>
          </div>

          <div className="theme-section">
            <h2>Dark Mode</h2>
            {Object.keys(colors.dark).map((key) => (
              <div key={key} className="color-input-group">
                <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={colors.dark[key]}
                    onChange={(e) => handleColorChange('dark', key, e.target.value)}
                  />
                  <input
                    type="text"
                    value={colors.dark[key]}
                    onChange={(e) => handleColorChange('dark', key, e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button onClick={() => applyTheme('dark')} className="btn btn-outline">Preview Dark</button>
          </div>
        </div>

        <button onClick={saveTheme} className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Save Theme
        </button>
      </div>
    </AdminLayout>
  )
}

export default AdminTheme
