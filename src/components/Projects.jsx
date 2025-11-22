import { useState, useEffect } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import './Projects.css'

function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .eq('is_published', true)
      .order('display_order')
      .then(({ data }) => setProjects(data || []))
  }, [])

  return (
    <section id="projects" className="projects-section">
      <h2 className="section-title">Featured <span>Projects</span></h2>
      
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-image">
              <img src={project.featured_image_url || 'https://via.placeholder.com/600x400'} alt={project.title} />
              <div className="project-overlay">
                <div className="project-links">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <FiGithub size={24} />
                    </a>
                  )}
                  {project.live_demo_url && (
                    <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                      <FiExternalLink size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.short_description}</p>
              
              <div className="project-tech">
                {project.tech_stack?.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects
