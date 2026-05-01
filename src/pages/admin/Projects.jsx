// src/pages/admin/Projects.jsx
import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiStar, FiX, FiExternalLink, FiGithub, FiImage
} from 'react-icons/fi'
import ConfirmModal from '../../components/admin/ConfirmModal';
import './Projects.css'

const EMPTY = {
  title: '', short_description: '', full_description: '',
  featured_image_url: '', tech_stack: '', github_url: '',
  live_demo_url: '', is_featured: false, is_published: true, is_visible: true,
}

export default function AdminProjects() {
  const [projects, setProjects]       = useState([])
  const [showModal, setShowModal]     = useState(false)
  const [editing, setEditing]         = useState(null)
  const [form, setForm]               = useState(EMPTY)
  const [saving, setSaving]           = useState(false)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, projectId: null });

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const data = await api.adminGetProjects()
      setProjects(data || [])
    } catch { toast.error('Failed to load projects') }
  }

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }

  const openEdit = (p) => {
    setEditing(p)
    setForm({ ...p, tech_stack: p.tech_stack?.join(', ') || '' })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.updateProject({ ...form, id: editing.id })
        toast.success('Project updated!')
      } else {
        await api.createProject(form)
        toast.success('Project created!')
      }
      closeModal(); load()
    } catch { toast.error('Error saving project') }
    finally { setSaving(false) }
  }

 const handleDelete = async (id) => {
  setConfirmModal({ isOpen: true, projectId: id });
};

const confirmDelete = async () => {
  try {
    await api.deleteProject(confirmModal.projectId);
    toast.success('Deleted');
    load();
  } catch {
    toast.error('Error deleting');
  } finally {
    setConfirmModal({ isOpen: false, projectId: null });
  }
};

  const toggleVis = async (p) => {
    try {
      await api.updateProject({ ...p, tech_stack: p.tech_stack?.join(', ') || '', is_visible: !p.is_visible })
      load()
    } catch { toast.error('Error') }
  }

  const toggleFeat = async (p) => {
    try {
      await api.updateProject({ ...p, tech_stack: p.tech_stack?.join(', ') || '', is_featured: !p.is_featured })
      load()
    } catch { toast.error('Error') }
  }

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  })

  return (
    <AdminLayout>
      <div className="adm-page">

        {/* ── header ── */}
        <div className="adm-header">
          <div>
            <h1 className="adm-title">Projects</h1>
            <p className="adm-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="adm-add-btn" onClick={openAdd}>
            <FiPlus size={15} /> Add Project
          </button>
        </div>

        {/* ── list ── */}
        <div className="adm-list">
          {projects.length === 0 && (
            <div className="adm-empty">
              <FiImage size={30} />
              <p>No projects yet. Add your first one!</p>
            </div>
          )}

          {projects.map(p => (
            <div key={p.id} className={'adm-card' + (!p.is_visible ? ' adm-card--dim' : '')}>

              {/* thumb */}
              <div className="adm-thumb">
                {p.featured_image_url
                  ? <img src={p.featured_image_url} alt={p.title} />
                  : <div className="adm-thumb-empty"><FiImage size={22} /></div>
                }
                {p.is_featured && <span className="adm-feat-pip">★</span>}
              </div>

              {/* content */}
              <div className="adm-content">
                <div className="adm-card-top">
                  <h3 className="adm-card-title">{p.title}</h3>
                  <div className="adm-badges">
                    {p.is_featured  && <span className="adm-badge adm-badge-feat">Featured</span>}
                    {!p.is_visible  && <span className="adm-badge adm-badge-hidden">Hidden</span>}
                    {p.is_published && <span className="adm-badge adm-badge-live">Live</span>}
                  </div>
                </div>

                <p className="adm-card-desc">{p.short_description}</p>

                <div className="adm-card-foot">
                  <div className="adm-tags">
                    {p.tech_stack?.map((t, i) => <span key={i} className="adm-tag">{t}</span>)}
                  </div>

                  <div className="adm-actions">
                    {p.live_demo_url && (
                      <a href={p.live_demo_url} target="_blank" rel="noopener noreferrer"
                        className="adm-icon-btn adm-icon-btn--link" title="Live Demo">
                        <FiExternalLink size={14} />
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                        className="adm-icon-btn adm-icon-btn--link" title="GitHub">
                        <FiGithub size={14} />
                      </a>
                    )}
                    <button onClick={() => toggleFeat(p)}
                      className={'adm-icon-btn' + (p.is_featured ? ' adm-icon-btn--feat' : '')}
                      title="Toggle featured">
                      <FiStar size={14} fill={p.is_featured ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => toggleVis(p)} className="adm-icon-btn" title="Toggle visibility">
                      {p.is_visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                    </button>
                    <button onClick={() => openEdit(p)} className="adm-icon-btn adm-icon-btn--edit" title="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="adm-icon-btn adm-icon-btn--del" title="Delete">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ── modal ── */}
        {showModal && (
          <div className="adm-backdrop" onClick={closeModal}>
            <div className="adm-modal" onClick={e => e.stopPropagation()}>

              <div className="adm-modal-head">
                <h2 className="adm-modal-title">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button className="adm-modal-close" onClick={closeModal}><FiX size={17} /></button>
              </div>

              {/* image preview strip */}
              {form.featured_image_url && (
                <div className="adm-img-preview">
                  <img src={form.featured_image_url} alt="preview" />
                  <div className="adm-img-fade" />
                </div>
              )}

              <div className="adm-modal-body">
                <form onSubmit={handleSubmit} className="adm-form">

                  <div className="adm-field">
                    <label className="adm-label">Project Title <span className="adm-req">*</span></label>
                    <input className="adm-input" type="text" placeholder="e.g. Neural Link Dashboard" required {...f('title')} />
                  </div>

                  <div className="adm-field">
                    <label className="adm-label">Short Description</label>
                    <textarea className="adm-input adm-textarea" rows={2} placeholder="One-liner shown on card" {...f('short_description')} />
                  </div>

                  <div className="adm-field">
                    <label className="adm-label">Full Description</label>
                    <textarea className="adm-input adm-textarea" rows={4} placeholder="Detailed description in modal" {...f('full_description')} />
                  </div>

                  <div className="adm-field">
                    <label className="adm-label">Featured Image URL</label>
                    <input className="adm-input" type="url" placeholder="https://..." {...f('featured_image_url')} />
                  </div>

                  <div className="adm-field">
                    <label className="adm-label">Tech Stack</label>
                    <input className="adm-input" type="text" placeholder="React, Node.js, PostgreSQL" {...f('tech_stack')} />
                    <span className="adm-hint">Comma-separated values</span>
                  </div>

                  <div className="adm-row">
                    <div className="adm-field">
                      <label className="adm-label"><FiGithub size={12} style={{verticalAlign:'middle',marginRight:'0.3rem'}}/>GitHub URL</label>
                      <input className="adm-input" type="url" placeholder="https://github.com/..." {...f('github_url')} />
                    </div>
                    <div className="adm-field">
                      <label className="adm-label"><FiExternalLink size={12} style={{verticalAlign:'middle',marginRight:'0.3rem'}}/>Live Demo URL</label>
                      <input className="adm-input" type="url" placeholder="https://..." {...f('live_demo_url')} />
                    </div>
                  </div>

                  <div className="adm-checks">
                    {[
                      { key: 'is_featured', label: 'Featured Project' },
                      { key: 'is_visible',  label: 'Visible on Website' },
                      { key: 'is_published',label: 'Published' },
                    ].map(({ key, label }) => (
                      <label key={key} className="adm-check">
                        <input type="checkbox" className="adm-checkbox"
                          checked={form[key]}
                          onChange={e => setForm({ ...form, [key]: e.target.checked })} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="adm-form-actions">
                    <button type="button" className="adm-btn adm-btn-outline" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                      {saving ? 'Saving…' : editing ? 'Update Project' : 'Add Project'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        )}

      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, projectId: null })}
      />
    </AdminLayout>
  )
}