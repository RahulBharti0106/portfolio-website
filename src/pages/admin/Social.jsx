// src/pages/admin/Social.jsx
import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'
import './Social.css'

function AdminSocial() {
  const [links, setLinks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [formData, setFormData] = useState({
    platform: '', url: '', icon: 'FiLink', visible: true
  })

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    try {
      const data = await api.adminGetSocials()
      setLinks(data || [])
    } catch (err) {
      toast.error('Failed to load links')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingLink) {
        await api.updateSocial({ ...formData, id: editingLink.id })
        toast.success('Link updated!')
      } else {
        await api.createSocial(formData)
        toast.success('Link added!')
      }
      setShowModal(false)
      resetForm()
      fetchLinks()
    } catch (error) {
      toast.error('Error saving link: ' + error.message)
    }
  }

  const handleEdit = (link) => {
    setEditingLink(link)
    setFormData({ platform: link.platform, url: link.url, icon: link.icon || 'FiLink', visible: link.visible })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this social link?')) return
    try {
      await api.deleteSocial(id)
      toast.success('Link deleted')
      fetchLinks()
    } catch (error) {
      toast.error('Error deleting link')
    }
  }

  const toggleVisibility = async (link) => {
    try {
      await api.updateSocial({ ...link, visible: !link.visible })
      toast.success(link.visible ? 'Link hidden' : 'Link visible')
      fetchLinks()
    } catch {
      toast.error('Error updating visibility')
    }
  }

  const resetForm = () => {
    setFormData({ platform: '', url: '', icon: 'FiLink', visible: true })
    setEditingLink(null)
  }

  const iconOptions = [
    { value: 'FiGithub', label: 'GitHub' },
    { value: 'FiLinkedin', label: 'LinkedIn' },
    { value: 'FiTwitter', label: 'Twitter' },
    { value: 'FiInstagram', label: 'Instagram' },
    { value: 'FiMail', label: 'Email' },
    { value: 'TbBrandTelegram', label: 'Telegram' },
    { value: 'FiLink', label: 'Generic Link' },
  ]

  return (
    <AdminLayout>
      <div className="admin-social">
        <div className="page-header">
          <h1>Social Links Management</h1>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="btn btn-primary">
            <FiPlus /> Add Link
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem', maxWidth: '900px' }}>
          {links.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No social links yet. Click "Add Link" to create one.
            </div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: link.visible ? 1 : 0.5 }}>
                <div>
                  <h3>{link.platform}</h3>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {link.url}
                  </a>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Icon: {link.icon}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => toggleVisibility(link)} className="btn-icon">
                    {link.visible ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button onClick={() => handleEdit(link)} className="btn-icon">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(link.id)} className="btn-icon danger">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm() }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingLink ? 'Edit Social Link' : 'Add Social Link'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Platform Name *</label>
                  <input type="text" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} placeholder="e.g., GitHub, LinkedIn" required />
                </div>
                <div className="form-group">
                  <label>URL *</label>
                  <input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://github.com/yourusername" required />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })}>
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} />
                    Visible on Website
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => { setShowModal(false); resetForm() }} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingLink ? 'Update Link' : 'Add Link'}
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

export default AdminSocial