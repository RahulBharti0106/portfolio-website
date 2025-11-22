import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './About.css'

function About() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => setProfile(data))
  }, [])

  if (!profile) return null

  return (
    <section id="about" className="about-section">
      <h2 className="section-title">About <span>Me</span></h2>
      
      <div className="about-content">
        <div className="about-image">
          <img src={profile.profile_image_url || 'https://via.placeholder.com/400'} alt={profile.name} />
        </div>
        
        <div className="about-text">
          <p className="about-bio">{profile.bio}</p>
          
          <div className="about-stats">
            <div className="stat">
              <h3>2+</h3>
              <p>Years Learning</p>
            </div>
            <div className="stat">
              <h3>10+</h3>
              <p>Projects</p>
            </div>
            <div className="stat">
              <h3>5+</h3>
              <p>Technologies</p>
            </div>
          </div>
          
          {profile.resume_url && (
            <a href={profile.resume_url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Download Resume
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default About
