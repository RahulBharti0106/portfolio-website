import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getSkillIcon } from '../utils/skillIcons';
import './Skills.css';

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Ref for the scrollable container
  const scrollRef = useRef(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load skills.");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Tolerance of 2px to handle fractional pixel rendering
    const tolerance = 2;

    // Show left arrow if we are not at the very start
    setShowLeftArrow(scrollLeft > tolerance);

    // Show right arrow if we are not at the very end
    // (scrollLeft + viewable width) < total scrollable width
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - tolerance);
  };

  // Attach listeners ONLY after loading is done and element exists
  useEffect(() => {
    const container = scrollRef.current;

    // Only run if not loading and container exists
    if (!loading && container) {

      // 1. Check immediately
      checkScrollPosition();

      // 2. Add listeners
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);

      // 3. Cleanup
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [loading, skills]); // Dependency array ensures this runs again after loading finishes

  // Scroll by one card width (plus gap)
  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    // Attempt to measure the first card dynamically
    const card = container.querySelector('.skill-card');

    // Default fallback if card not found immediately
    const cardWidth = card ? card.offsetWidth : 300;
    const gap = 32; // matches 2rem gap in CSS
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
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
        {/* Left Arrow Button */}
        <button
          className={`skills-arrow left ${!showLeftArrow ? 'hidden' : ''}`}
          onClick={() => scrollByAmount('left')}
          aria-label="Scroll left"
          style={{ opacity: showLeftArrow ? 1 : 0, pointerEvents: showLeftArrow ? 'auto' : 'none' }}
        >
          ‹
        </button>

        {/* Scrollable Track Container */}
        <div className="skills-track-container" ref={scrollRef}>
          <div className="skills-track">
            {skills.map((skill) => {
              const iconData = getSkillIcon(skill.icon);
              const IconComponent = iconData.icon;
              const iconColor = iconData.color;

              return (
                <div
                  key={skill.id}
                  className="skill-card"
                >
                  <div className="skill-icon" style={{ color: iconColor }}>
                    <IconComponent size={48} />
                  </div>
                  <h3 className="skill-name">{skill.name}</h3>
                  <p className="skill-category">{skill.category}</p>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}>
                      <span className="skill-percent">{skill.proficiency}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          className={`skills-arrow right ${!showRightArrow ? 'hidden' : ''}`}
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
