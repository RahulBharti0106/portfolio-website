import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FiGithub, FiLinkedin, FiMail, FiTwitter, FiInstagram } from 'react-icons/fi';
import './About.css';

function About() {
  const [profile, setProfile] = useState(null);
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: profileData } = await supabase
          .from('profile')
          .select('*')
          .single();

        const { data: socialsData } = await supabase
          .from('social_links')
          .select('*')
          .eq('visible', true)
          .order('id');

        if (profileData) setProfile(profileData);
        if (socialsData) setSocials(socialsData);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Icon mapping for social links
  const getIcon = (iconName) => {
    const icons = {
      FiGithub: FiGithub,
      FiLinkedin: FiLinkedin,
      FiMail: FiMail,
      FiTwitter: FiTwitter,
      FiInstagram: FiInstagram,
    };
    return icons[iconName] || FiMail;
  };

  // Safe render checks
  if (loading) return null;
  if (!profile || profile.about_visible === false) return null;

  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">About <span>Me</span></h2>
        <div className="about-content">
          {/* Left: Bio Text */}
          <div className="about-text">
            <p className="about-bio">
              {profile.bio_about || "Welcome to my portfolio!"}
            </p>
          </div>

          {/* Right: Animated Social Card */}
          <div className="social-card-wrapper">
            <div className="card">
              <div className="background"></div>
              <div className="logo">Socials</div>

              {socials.slice(0, 3).map((social, index) => {
                const Icon = getIcon(social.icon);
                return (
                  <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer">
                    <div className={`box box${index + 1}`}>
                      <span className="icon">
                        <Icon className="svg" />
                      </span>
                    </div>
                  </a>
                );
              })}

              <div className="box box4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;