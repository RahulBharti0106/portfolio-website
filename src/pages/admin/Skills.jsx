import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
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
    name: '',
    icon: 'FaCode',
    category: 'Frontend',
    proficiency: 50,
    description: '',
    is_visible: true
  })

  // Get all available icons for dropdown
  const availableIcons = getAvailableIcons()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      toast.error('Error fetching skills')
    } else {
      setSkills(data || [])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(formData)
          .eq('id', editingSkill.id)

        if (error) throw error
        toast.success('Skill updated!')
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([{ ...formData, display_order: skills.length + 1 }])

        if (error) throw error
        toast.success('Skill added!')
      }

      setShowModal(false)
      setEditingSkill(null)
      resetForm()
      fetchSkills()
    } catch (error) {
      toast.error('Error saving skill')
      console.error(error)
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setFormData(skill)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Skill deleted')
      fetchSkills()
    } catch (error) {
      toast.error('Error deleting skill')
    }
  }

  const toggleVisibility = async (skill) => {
    try {
      const { error } = await supabase
        .from('skills')
        .update({ is_visible: !skill.is_visible })
        .eq('id', skill.id)

      if (error) throw error
      toast.success(skill.is_visible ? 'Skill hidden' : 'Skill visible')
      fetchSkills()
    } catch (error) {
      toast.error('Error updating visibility')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      icon: 'FaCode',
      category: 'Frontend',
      proficiency: 50,
      description: '',
      is_visible: true
    })
  }

  const openAddModal = () => {
    setEditingSkill(null)
    resetForm()
    setShowModal(true)
  }

  // Group icons by category for better dropdown organization
  const groupedIcons = availableIcons.reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = []
    }
    acc[icon.category].push(icon)
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="admin-skills">
        <div className="page-header">
          <h1>Skills Management</h1>
          <button onClick={openAddModal} className="btn btn-primary">
            <FiPlus /> Add Skill
          </button>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => {
            const iconData = getSkillIcon(skill.icon)
            const IconComponent = iconData.icon
            const iconColor = iconData.color

            return (
              <div key={skill.id} className={`skill-card ${!skill.is_visible ? 'hidden' : ''}`}>
                <div className="skill-icon" style={{ color: iconColor }}>
                  <IconComponent size={48} />
                </div>
                <h3>{skill.name}</h3>
                <p className="skill-category">{skill.category}</p>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}>
                    {skill.proficiency}%
                  </div>
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
                  <label>Icon (SVG with Official Colors)</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    style={{ padding: '0.75rem', fontSize: '1rem' }}
                  >
                    {Object.keys(groupedIcons).map(category => (
                      <optgroup key={category} label={category}>
                        {groupedIcons[category].map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preview:</span>
                    {(() => {
                      const iconData = getSkillIcon(formData.icon)
                      const PreviewIcon = iconData.icon
                      const iconColor = iconData.color
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <PreviewIcon size={32} style={{ color: iconColor }} />
                          <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            fontFamily: 'monospace'
                          }}>
                            {iconColor}
                          </span>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Tools">Tools</option>
                    <option value="Design">Design</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Proficiency: {formData.proficiency}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    />
                    Visible on website
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
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