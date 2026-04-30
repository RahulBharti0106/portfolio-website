// src/components/Hero.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TbBrandTelegram } from 'react-icons/tb'
import { FiGithub, FiLinkedin, FiMail, FiInstagram, FiMapPin, FiCode, FiBookOpen, FiArrowRight } from 'react-icons/fi'
import { api } from '../lib/api'
import './Hero.css'

function Hero() {
  const [profile, setProfile] = useState(null)
  const [socials, setSocials] = useState([])

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [profileData, socialsData] = await Promise.all([
        api.getProfile(),
        api.getSocials(),
      ])
      setProfile(profileData)
      setSocials(socialsData || [])
    } catch (err) {
      console.error('Hero fetch error:', err)
    }
  }

  if (!profile) return <div className="hero-skeleton" />

  const iconMap = {
    FiGithub, FiLinkedin, FiMail,
    TbBrandTelegram, FiInstagram,
  }

  return (
    <section id="home" className="hero">
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      <div className="hero-wrapper">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Banner ── */}
          <div className="profile-banner">
            {profile.banner_url
              ? <img src={profile.banner_url} alt="Banner" className="profile-banner-img" />
              : <div className="profile-banner-default" />
            }
            <div className="profile-banner-overlay" />
          </div>

          {/* ── Body ── */}
          <div className="profile-body">
            {/* Avatar */}
            <div className="profile-avatar-wrap">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={profile.name} className="profile-avatar" />
                : <div className="profile-avatar" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', color:'var(--text-secondary)' }}>
                    {profile.name?.[0] ?? '?'}
                  </div>
              }
            </div>

            {/* CTA Buttons */}
            <div className="profile-actions">
              <a href="#projects" className="btn-outline-card">View Projects</a>
              <a href="#contact" className="btn-glow-card">
                Contact <FiArrowRight size={14} />
              </a>
            </div>

            {/* Name & Tagline */}
            <div className="profile-identity">
              <motion.h1 className="profile-name"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}>
                {profile.name}
              </motion.h1>
              <motion.h2 className="profile-tagline"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}>
                {profile.tagline}
              </motion.h2>
            </div>

            {/* Bio */}
            <motion.p className="profile-bio"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}>
              {profile.short_bio}
            </motion.p>

            {/* Tags */}
            <motion.div className="profile-tags"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}>
              {profile.degree && (
                <span className="profile-tag"><FiBookOpen size={13} className="tag-icon" />{profile.degree}</span>
              )}
              {profile.location && (
                <span className="profile-tag"><FiMapPin size={13} className="tag-icon" />{profile.location}</span>
              )}
              {profile.status && (
                <span className="profile-tag"><FiCode size={13} className="tag-icon" />{profile.status}</span>
              )}
            </motion.div>

            <div className="profile-divider" />

            {/* Socials */}
            <motion.div className="profile-socials"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}>
              {socials.map((social) => {
                const Icon = iconMap[social.icon] || FiMail
                return (
                  <motion.a key={social.id} href={social.url}
                    target="_blank" rel="noopener noreferrer"
                    aria-label={social.platform} title={social.platform}
                    className="social-link"
                    whileHover={{ y: -3, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero