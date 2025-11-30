import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import Cubes from './Cubes'
import './Hero.css'

function Hero() {
  const [profile, setProfile] = useState(null)
  const [socials, setSocials] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: profileData } = await supabase.from('profile').select('*').single()
    const { data: socialsData } = await supabase
      .from('social_links')
      .select('*')
      .eq('visible', true)
      .order('id')

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
      <div className="hero-container">
        {/* Left Side: Content */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
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

        {/* Right Side: Animated Cubes */}
        <motion.div
          className="hero-cubes"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Cubes
            gridSize={7}
            maxAngle={60}
            radius={4}
            borderStyle="2px dashed rgba(99, 102, 241, 0.5)"
            faceColor="rgba(26, 26, 46, 0.6)"
            rippleColor="#6366f1"
            rippleSpeed={1.5}
            autoAnimate={true}
            rippleOnClick={true}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero