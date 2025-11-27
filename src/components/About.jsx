import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SocialLinks from './SocialLinks'; // Check this path!
import './About.css';

function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await supabase.from('profile').select('*').single();
        setProfile(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return null;
  // If profile doesn't exist or is hidden, don't render
  if (!profile || !profile.about_visible) return null;

  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">About <span>Me</span></h2>
        <div className="about-content">
          <div className="about-text">
            <p className="about-bio">{profile.bio_about || "Welcome to my portfolio!"}</p>

            <div className="about-stats">
              <div className="stat">
                <h3>{profile.experience_years || 0}+</h3>
                <p>Years Exp</p>
              </div>
              <div className="stat">
                <h3>{profile.projects_count || 0}+</h3>
                <p>Projects</p>
              </div>
            </div>

            {/* Social Links here */}
            <div style={{ marginTop: '1.5rem' }}>
              <SocialLinks className="about-socials" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
