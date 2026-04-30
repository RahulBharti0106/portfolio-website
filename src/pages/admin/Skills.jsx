// src/pages/admin/Skills.jsx
import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'
import { getSkillIcon, getAvailableIcons } from '../../utils/skillIcons'
import './Skills.css'

function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [formData, setFormData] = useState({
    name: '', icon: 'FaCode', category: '', description: '', is_visible: true
  })

  const availableIcons = getAvailableIcons()

  useEffect(() => { fetchSkills() }, [])

  const fetchSkills = async () => {
    try {
      const data = await api.adminGetSkills()
      setSkills(data || [])
    } catch (err) {
      toast.error('Error fetching skills')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSkill) {
        await api.updateSkill({ ...formData, id: editingSkill.id })
        toast.success('Skill updated!')
      } else {
        await api.createSkill(formData)
        toast.success('Skill added!')
      }
      setShowModal(false)
      setEditingSkill(null)
      resetForm()
      fetchSkills()
    } catch (error) {
      toast.error('Error saving skill')
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      icon: skill.icon,
      category: skill.category || '',
      is_visible: skill.is_visible,
      description: skill.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    try {
      await api.deleteSkill(id)
      toast.success('Skill deleted')
      fetchSkills()
    } catch {
      toast.error('Error deleting skill')
    }
  }

  const toggleVisibility = async (skill) => {
    try {
      await api.updateSkill({ id: skill.id, ...skill, is_visible: !skill.is_visible })
      toast.success(skill.is_visible ? 'Skill hidden' : 'Skill visible')
      fetchSkills()
    } catch {
      toast.error('Error updating visibility')
    }
  }

  const resetForm = () => setFormData({ name: '', icon: 'FaCode', category: '', description: '', is_visible: true })

  const groupedIcons = availableIcons.reduce((acc, icon) => {
    if (!acc[icon.category]) acc[icon.category] = []
    acc[icon.category].push(icon)
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="admin-skills">
        <div className="page-header">
          <h1>Skills Management</h1>
          <button onClick={() => { setEditingSkill(null); resetForm(); setShowModal(true) }} className="btn btn-primary">
            <FiPlus /> Add Skill
          </button>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => {
            const iconData = getSkillIcon(skill.icon)
            const IconComponent = iconData.icon
            const iconColor = iconData.color
            const tags = skill.category ? skill.category.split(',') : []

            return (
              <div key={skill.id} className={`skill-card ${!skill.is_visible ? 'hidden' : ''}`}>
                <div className="skill-icon" style={{ color: iconColor }}>
                  <IconComponent size={48} />
                </div>
                <h3>{skill.name}</h3>
                <div className="skill-tags-preview">
                  {tags.length > 0 ? tags.map((t, i) => (
                    <span key={i} className="skill-tag-badge">{t.trim()}</span>
                  )) : (
                    <span className="skill-tag-badge" style={{ opacity: 0.5 }}>No Category</span>
                  )}
                </div>
                <div className="skill-actions">
                  <button onClick={() => toggleVisibility(skill)} className="btn-icon">
                    {skill.is_visible ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button onClick={() => handleEdit(skill)} className="btn-icon">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="btn-icon danger">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Skill Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    style={{ padding: '0.75rem', fontSize: '1rem' }}
                  >
                    {Object.keys(groupedIcons).map(category => (
                      <optgroup key={category} label={category}>
                        {groupedIcons[category].map(icon => (
                          <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {/* Icon Preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preview:</span>
                    {(() => {
                      const iconData = getSkillIcon(formData.icon)
                      const PreviewIcon = iconData.icon
                      return <PreviewIcon size={32} style={{ color: iconData.color }} />
                    })()}
                  </div>
                </div>

                <div className="form-group">
                  <label>Categories (comma separated)</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Backend, Frontend"
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      style={{ width: 'auto' }}
                    />
                    Visible on website
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingSkill ? 'Update' : 'Add'} Skill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminSkills