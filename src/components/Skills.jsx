import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import './Skills.css'

function Skills() {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')
      .then(({ data }) => setSkills(data || []))
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section id="skills" className="skills-section">
      <h2 className="section-title">My <span>Skills</span></h2>
      
      <motion.div className="skills-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {skills.map((skill) => (
          <motion.div key={skill.id} className="skill-card" variants={item}>
            <div className="skill-icon" style={{ fontSize: '3rem' }}>{skill.icon}</div>
            <h3 className="skill-name">{skill.name}</h3>
            <p className="skill-category">{skill.category}</p>
            <div className="skill-bar">
              <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}>
                <span className="skill-percent">{skill.proficiency}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Skills
