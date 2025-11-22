import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiStar } from 'react-icons/fi'
import './Projects.css'

function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    featured_image_url: '',
    tech_stack: '',
    github_url: '',
    live_demo_url: '',
    is_featured: false,
    is_published: true,
    is_visible: true
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order')
    setProjects(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const projectData = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map(t => t.trim())
    }

    try {
      if (editingProject) {
        await supabase.from('projects').update(projectData).eq('id', editingProject.id)
        toast.success('Project updated!')
      } else {
        await supabase.from('projects').insert([{ ...projectData, display_order: projects.length + 1 }])
        toast.success('Project added!')
      }
      setShowModal(false)
      resetForm()
      fetchProjects()
    } catch (error) {
      toast.error('Error saving project')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      ...project,
      tech_stack: project.tech_stack?.join(', ') || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Project deleted')
    fetchProjects()
  }

  const toggleVisibility = async (project) => {
    await supabase.from('projects').update({ is_visible: !project.is_visible }).eq('id', project.id)
    fetchProjects()
  }

  const toggleFeatured = async (project) => {
    await supabase.from('projects').update({ is_featured: !project.is_featured }).eq('id', project.id)
    fetchProjects()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      short_description: '',
      full_description: '',
      featured_image_url: '',
      tech_stack: '',
      github_url: '',
      live_demo_url: '',
      is_featured: false,
      is_published: true,
      is_visible: true
    })
    setEditingProject(null)
  }

  return (
    <AdminLayout>
      <div className="admin-projects">
        <div className="page-header">
          <h1>Projects Management</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <FiPlus /> Add Project
          </button>
        </div>

        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className={`project-card ${!project.is_visible ? 'hidden' : ''}`}>
              {project.featured_image_url && (
                <img src={project.featured_image_url} alt={project.title} className="project-img" />
              )}
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.short_description}</p>
                <div className="project-tech">
                  {project.tech_stack?.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <button onClick={() => toggleFeatured(project)} className="btn-icon">
                    <FiStar fill={project.is_featured ? 'gold' : 'none'} color={project.is_featured ? 'gold' : 'currentColor'} />
                  </button>
                  <button onClick={() => toggleVisibility(project)} className="btn-icon">
                    {project.is_visible ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button onClick={() => handleEdit(project)} className="btn-icon">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="btn-icon danger">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal large" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label>Short Description</label>
                  <textarea rows="2" value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Full Description</label>
                  <textarea rows="4" value={formData.full_description || ''} onChange={(e) => setFormData({ ...formData, full_description: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Featured Image URL</label>
                  <input type="url" value={formData.featured_image_url || ''} onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Tech Stack (comma separated)</label>
                  <input type="text" value={formData.tech_stack} onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })} placeholder="React, Node.js, MongoDB" />
                </div>

                <div className="form-group">
                  <label>GitHub URL</label>
                  <input type="url" value={formData.github_url || ''} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Live Demo URL</label>
                  <input type="url" value={formData.live_demo_url || ''} onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })} />
                </div>

                <div className="form-checks">
                  <label>
                    <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
                    Featured Project
                  </label>
                  <label>
                    <input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} />
                    Visible on Website
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingProject ? 'Update' : 'Add'} Project</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminProjects
