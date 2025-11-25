import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './About.css'

function About() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("profile")
      .select("*")
      .single()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [])

  if (loading) return null;
  if (!profile || !profile.about_visible) return null;

  return (
    <section id="about" className="about-section">
      <h2 className="section-title">About <span>Me</span></h2>
      <div className="about-content">
        <div className="about-image">
          <img src={profile.profile_image_url || 'https://via.placeholder.com/400'} alt={profile.name} />
        </div>
        <div className="about-text">
          <p className="about-bio">{profile.bio_about}</p>
          <div className="about-stats">
            <div className="stat">
              <h3>{profile.experience_years || 0}+</h3>
              <p>Years Learning</p>
            </div>
            <div className="stat">
              <h3>{profile.projects_count || 0}+</h3>
              <p>Projects</p>
            </div>
            <div className="stat">
              <h3>5+</h3>
              <p>Technologies</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
