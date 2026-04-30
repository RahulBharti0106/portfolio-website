// src/components/Skills.jsx
import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { getSkillIcon } from '../utils/skillIcons';
import './Skills.css';

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.getSkills();
        setSkills(data || []);
      } catch (err) {
        console.error('Skills fetch error:', err);
        setError('Failed to load skills.');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const tolerance = 2;
    setShowLeftArrow(scrollLeft > tolerance);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - tolerance);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!loading && container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [loading, skills]);

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector('.skill-card');
    const cardWidth = card ? card.offsetWidth : 300;
    const gap = 32;
    container.scrollBy({
      left: direction === 'right' ? cardWidth + gap : -(cardWidth + gap),
      behavior: 'smooth',
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading skills...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  if (skills.length === 0) return <div style={{ textAlign: 'center', padding: '2rem' }}>No skills found.</div>;

  return (
    <section id="skills" className="skills-section">
      <h2 className="section-title">My <span>Skills</span></h2>

      <div className="skills-slider-wrapper">
        <button
          className="skills-arrow left"
          onClick={() => scrollByAmount('left')}
          aria-label="Scroll left"
          style={{ opacity: showLeftArrow ? 1 : 0, pointerEvents: showLeftArrow ? 'auto' : 'none' }}
        >
          ‹
        </button>

        <div className="skills-track-container" ref={scrollRef}>
          <div className="skills-track">
            {skills.map((skill) => {
              const iconData = getSkillIcon(skill.icon);
              const IconComponent = iconData.icon;
              const iconColor = iconData.color;
              const categories = skill.category
                ? skill.category.split(',').map(c => c.trim())
                : [];

              return (
                <div key={skill.id} className="skill-card">
                  <div className="skill-icon" style={{ color: iconColor }}>
                    <IconComponent size={48} />
                  </div>
                  <h3 className="skill-name">{skill.name}</h3>
                  <div className="skill-tags">
                    {categories.length > 0 ? (
                      categories.map((cat, idx) => (
                        <span key={idx} className="skill-tag">{cat}</span>
                      ))
                    ) : (
                      <span className="skill-tag">General</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="skills-arrow right"
          onClick={() => scrollByAmount('right')}
          aria-label="Scroll right"
          style={{ opacity: showRightArrow ? 1 : 0, pointerEvents: showRightArrow ? 'auto' : 'none' }}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default Skills;