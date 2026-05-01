// src/pages/admin/FooterSettings.jsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../lib/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSave } from 'react-icons/fi'
import ConfirmModal from '../../components/admin/ConfirmModal';
import './FooterSettings.css'

function AdminFooterSettings() {
  const [footerSettings, setFooterSettings] = useState({
    brand_name: 'Portfolio', description: 'Building amazing digital experiences',
    show_product_column: true, product_column_title: 'Product',
    show_resources_column: true, resources_column_title: 'Resources',
    show_company_column: false, company_column_title: 'Company',
    copyright_text: 'All rights reserved.'
  })
  const [companyLinks, setCompanyLinks] = useState([])
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [linkForm, setLinkForm] = useState({ label: '', url: '', is_visible: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, linkId: null });

  useEffect(() => { fetchFooterData() }, [])

  const fetchFooterData = async () => {
    try {
      const data = await api.adminGetFooter()
      if (data.settings) setFooterSettings(data.settings)
      setCompanyLinks(data.links || [])
    } catch (err) {
      toast.error('Failed to load footer settings')
    } finally {
      setLoading(false)
    }
  }

  const saveFooterSettings = async () => {
    setSaving(true)
    try {
      await api.updateFooterSettings(footerSettings)
      toast.success('✅ Footer settings saved!')
      fetchFooterData()
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const openLinkModal = (link = null) => {
    if (link) {
      setEditingLink(link)
      setLinkForm({ label: link.label, url: link.url, is_visible: link.is_visible })
    } else {
      setEditingLink(null)
      setLinkForm({ label: '', url: '', is_visible: true })
    }
    setShowLinkModal(true)
  }

 const saveLinkHandler = async (e) => {
  e.preventDefault()
  try {
    if (editingLink) {
      await api.updateFooterSettings({
        _link_update: { id: editingLink.id, ...linkForm }
      })
      toast.success('Link updated!')
    } else {
      await api.createFooterLink(linkForm)
      toast.success('Link added!')
    }
    setShowLinkModal(false)
    fetchFooterData()
  } catch (err) {
    toast.error('Failed to save link: ' + err.message)
  }
}
const deleteLink = (id) => {
  setConfirmModal({ isOpen: true, linkId: id });
};

const confirmDelete = async () => {
  try {
    await api.deleteFooterLink(confirmModal.linkId);
    toast.success('Link deleted');
    fetchFooterData();
  } catch {
    toast.error('Failed to delete link');
  } finally {
    setConfirmModal({ isOpen: false, linkId: null });
  }
};
  if (loading) return <AdminLayout><div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="admin-footer-settings">
        <div className="page-header">
          <h1>Footer Settings</h1>
          <button onClick={saveFooterSettings} className="btn btn-primary" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Brand Section */}
        <div className="settings-section">
          <h2>Brand Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Brand Name</label>
              <input type="text" value={footerSettings.brand_name} onChange={(e) => setFooterSettings({ ...footerSettings, brand_name: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea value={footerSettings.description} onChange={(e) => setFooterSettings({ ...footerSettings, description: e.target.value })} rows="3" />
            </div>
            <div className="form-group full-width">
              <label>Copyright Text</label>
              <input type="text" value={footerSettings.copyright_text} onChange={(e) => setFooterSettings({ ...footerSettings, copyright_text: e.target.value })} />
              <small>Year is added automatically</small>
            </div>
          </div>
        </div>

        {/* Column Settings */}
        <div className="settings-section">
          <h2>Footer Columns</h2>

          {/* Product Column */}
          <div className="column-setting">
            <div className="column-header">
              <label className="toggle-label">
                <input type="checkbox" checked={footerSettings.show_product_column} onChange={(e) => setFooterSettings({ ...footerSettings, show_product_column: e.target.checked })} />
                <span>Show Product Column (Projects)</span>
              </label>
            </div>
            {footerSettings.show_product_column && (
              <div className="form-group">
                <label>Column Title</label>
                <input type="text" value={footerSettings.product_column_title} onChange={(e) => setFooterSettings({ ...footerSettings, product_column_title: e.target.value })} />
                <small>Shows published projects (max 5)</small>
              </div>
            )}
          </div>

          {/* Resources Column */}
          <div className="column-setting">
            <div className="column-header">
              <label className="toggle-label">
                <input type="checkbox" checked={footerSettings.show_resources_column} onChange={(e) => setFooterSettings({ ...footerSettings, show_resources_column: e.target.checked })} />
                <span>Show Resources Column (Skills)</span>
              </label>
            </div>
            {footerSettings.show_resources_column && (
              <div className="form-group">
                <label>Column Title</label>
                <input type="text" value={footerSettings.resources_column_title} onChange={(e) => setFooterSettings({ ...footerSettings, resources_column_title: e.target.value })} />
                <small>Shows visible skills (max 6)</small>
              </div>
            )}
          </div>

          {/* Company Column */}
          <div className="column-setting">
            <div className="column-header">
              <label className="toggle-label">
                <input type="checkbox" checked={footerSettings.show_company_column} onChange={(e) => setFooterSettings({ ...footerSettings, show_company_column: e.target.checked })} />
                <span>Show Company Column (Custom Links)</span>
              </label>
            </div>
            {footerSettings.show_company_column && (
              <>
                <div className="form-group">
                  <label>Column Title</label>
                  <input type="text" value={footerSettings.company_column_title} onChange={(e) => setFooterSettings({ ...footerSettings, company_column_title: e.target.value })} />
                </div>
                <div className="links-manager">
                  <div className="links-header">
                    <h3>Custom Links</h3>
                    <button onClick={() => openLinkModal()} className="btn btn-sm btn-primary">
                      <FiPlus /> Add Link
                    </button>
                  </div>
                  <div className="links-list">
                    {companyLinks.length === 0 ? (
                      <p className="empty-state">No links added yet</p>
                    ) : (
                      companyLinks.map((link) => (
                        <div key={link.id} className={`link-item ${!link.is_visible ? 'hidden' : ''}`}>
                          <div className="link-info">
                            <span className="link-label">{link.label}</span>
                            <span className="link-url">{link.url}</span>
                          </div>
                          <div className="link-actions">
                            <button onClick={() => openLinkModal(link)} className="btn-icon"><FiEdit2 /></button>
                            <button onClick={() => deleteLink(link.id)} className="btn-icon danger"><FiTrash2 /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Link Modal */}
        {showLinkModal && (
          <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingLink ? 'Edit Link' : 'Add New Link'}</h2>
              <form onSubmit={saveLinkHandler}>
                <div className="form-group">
                  <label>Link Label</label>
                  <input type="text" value={linkForm.label} onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })} placeholder="Certifications" required />
                </div>
                <div className="form-group">
                  <label>URL</label>
                  <input type="text" value={linkForm.url} onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })} placeholder="#certifications or https://..." required />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowLinkModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingLink ? 'Update' : 'Add'} Link</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Link"
        message="Are you sure you want to delete this link?"
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, linkId: null })}
      />
    </AdminLayout>
  )
}

export default AdminFooterSettings