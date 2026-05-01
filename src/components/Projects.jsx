// src/components/Projects.jsx
import { useState, useEffect, useRef } from 'react'
import { FiGithub, FiExternalLink, FiX, FiCalendar, FiUser, FiCode, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { api } from '../lib/api'
import { ProjectsSkeleton } from './Skeletons';
import './Projects.css'

function Projects() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const railRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProjects()
      .then(data => setProjects(data || []))
      .catch(err => console.error('Projects fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  /* ── lock body scroll when modal open ── */
  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  /* ── arrow visibility ── */
  const updateArrows = () => {
    const el = railRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    // slight delay so DOM has rendered
    setTimeout(updateArrows, 100)
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [projects])

  const scrollRail = (dir) => {
    const el = railRef.current
    if (!el) return
    const card = el.querySelector('.prj-card')
    const amount = card ? card.offsetWidth + 32 : 400
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  if (loading) return <ProjectsSkeleton />

  return (
    <>
      {/* ═══════════════════════════════════════
          SECTION
      ═══════════════════════════════════════ */}
      <section id="projects" className="prj-section">

        {/* Header */}
        <div className="prj-header">
          <span className="prj-eyebrow">Curated Engineering</span>
          <div className="prj-title-row">
            <h2 className="prj-title">Featured Projects</h2>
            <div className="prj-title-line" />
          </div>
        </div>

        {/* Carousel */}
        <div className="prj-rail-wrap">

          <button
            className={'prj-arrow prj-arrow-left' + (!canScrollLeft ? ' prj-arrow-hidden' : '')}
            onClick={() => scrollRail(-1)}
            aria-label="Previous"
          >
            <FiChevronLeft size={20} />
          </button>

          <div className="prj-rail" ref={railRef}>
            {projects.map(project => (
              <article
                key={project.id}
                className="prj-card"
                onClick={() => setSelectedProject(project)}
              >
                {/* image */}
                <div className="prj-card-img">
                  <div className="prj-card-img-overlay" />
                  <img
                    src={project.featured_image_url || 'https://placehold.co/800x450/1c1b1c/7bd0ff?text=Project'}
                    alt={project.title}
                  />
                </div>

                {/* body */}
                <div className="prj-card-body">
                  <div className="prj-card-top">
                    <h3 className="prj-card-name">{project.title}</h3>
                    {project.is_featured && <span className="prj-featured-pill">Featured</span>}
                  </div>
                  <p className="prj-card-desc">{project.short_description}</p>
                  <div className="prj-card-foot">
                    <div className="prj-tags">
                      {project.tech_stack?.slice(0, 3).map((t, i) => (
                        <span key={i} className="prj-tag">{t}</span>
                      ))}
                      {project.tech_stack?.length > 3 && (
                        <span className="prj-tag prj-tag-more">+{project.tech_stack.length - 3}</span>
                      )}
                    </div>
                    <div className="prj-links">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="prj-link" onClick={e => e.stopPropagation()} aria-label="GitHub">
                          <FiGithub size={15} />
                        </a>
                      )}
                      {project.live_demo_url && (
                        <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer"
                          className="prj-link" onClick={e => e.stopPropagation()} aria-label="Live Demo">
                          <FiExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="prj-card-glow" />
              </article>
            ))}
          </div>

          <button
            className={'prj-arrow prj-arrow-right' + (!canScrollRight ? ' prj-arrow-hidden' : '')}
            onClick={() => scrollRail(1)}
            aria-label="Next"
          >
            <FiChevronRight size={20} />
          </button>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          MODAL
          Structure: backdrop > modal-box > modal-scroll > [hero + body]
          The ONLY element with overflow:auto is modal-scroll.
          Hero is a normal block inside modal-scroll → scrolls with content.
      ═══════════════════════════════════════ */}
      {selectedProject && (
        <div className="prj-backdrop" onClick={() => setSelectedProject(null)}>

          {/* modal box — no overflow, just sizing + border */}
          <div className="prj-modal" onClick={e => e.stopPropagation()}>

            {/* close btn — absolute, always visible */}
            <button className="prj-modal-close" onClick={() => setSelectedProject(null)} aria-label="Close">
              <FiX size={18} />
            </button>

            {/* ONE scrollable container */}
            <div className="prj-modal-scroll">

              {/* hero — normal block, scrolls away naturally */}
              <div className="prj-modal-hero">
                <div className="prj-modal-hero-fade" />
                <img
                  src={selectedProject.featured_image_url || 'https://placehold.co/1200x500/1c1b1c/7bd0ff?text=Project'}
                  alt={selectedProject.title}
                />
              </div>

              {/* content */}
              <div className="prj-modal-body">
                <div className="prj-modal-tags">
                  {selectedProject.tech_stack?.map((t, i) => (
                    <span key={i} className={'prj-modal-tag' + (i === 0 ? ' prj-modal-tag-accent' : '')}>{t}</span>
                  ))}
                </div>

                <h2 className="prj-modal-title">{selectedProject.title}</h2>

                <div className="prj-modal-grid">
                  <div>
                    <p className="prj-modal-desc">
                      {selectedProject.full_description || selectedProject.short_description}
                    </p>
                    {selectedProject.full_description && selectedProject.short_description && (
                      <p className="prj-modal-short">{selectedProject.short_description}</p>
                    )}
                  </div>

                  <div className="prj-modal-meta">
                    <div className="prj-meta-item">
                      <FiCalendar size={13} />
                      <div>
                        <span className="prj-meta-label">Status</span>
                        <span className="prj-meta-val">{selectedProject.is_published ? 'Live' : 'In Progress'}</span>
                      </div>
                    </div>
                    <div className="prj-meta-item">
                      <FiUser size={13} />
                      <div>
                        <span className="prj-meta-label">Type</span>
                        <span className="prj-meta-val">{selectedProject.is_featured ? 'Featured Work' : 'Personal Project'}</span>
                      </div>
                    </div>
                    <div className="prj-meta-item">
                      <FiCode size={13} />
                      <div>
                        <span className="prj-meta-label">Tech Stack</span>
                        <span className="prj-meta-val">{selectedProject.tech_stack?.join(', ') || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prj-modal-actions">
                  {selectedProject.live_demo_url && (
                    <a href={selectedProject.live_demo_url} target="_blank" rel="noopener noreferrer"
                      className="prj-btn prj-btn-primary">
                      <FiExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer"
                      className="prj-btn prj-btn-secondary">
                      <FiGithub size={16} /> Source Code
                    </a>
                  )}
                </div>
              </div>

            </div>{/* /prj-modal-scroll */}
          </div>{/* /prj-modal */}
        </div>
      )}
    </>
  )
}

export default Projects