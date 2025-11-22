import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import './Hero.css'

function Hero() {
  const [profile, setProfile] = useState(null)
  const [socials, setSocials] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: profileData } = await supabase.from('profile').select('*').single()
    const { data: socialsData } = await supabase.from('social_links').select('*').eq('is_visible', true).order('display_order')
    
    setProfile(profileData)
    setSocials(socialsData || [])
  }

  if (!profile) return <div style={{ minHeight: '100vh' }} />

  const iconMap = {
    FiGithub: FiGithub,
    FiLinkedin: FiLinkedin,
    FiMail: FiMail
  }

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="hero-content">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="hero-greeting">Hi, I'm</p>
          <h1 className="hero-name">{profile.name}</h1>
          <h2 className="hero-title">{profile.tagline}</h2>
          <p className="hero-description">{profile.short_bio}</p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-outline">Get In Touch</a>
          </div>

          <div className="hero-socials">
            {socials.map((social) => {
              const Icon = iconMap[social.icon] || FiMail
              return (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform}>
                  <Icon size={24} />
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>

      <a href="#about" className="scroll-indicator">
        <FiArrowDown size={24} />
      </a>
    </section>
  )
}

export default Hero
