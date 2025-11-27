import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SocialLinks from './SocialLinks'; // Ensure this file exists in same folder!
import './About.css';

function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .single();

        if (!error && data) setProfile(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  // Safe render checks
  if (loading) return null;
  if (!profile || profile.about_visible === false) return null;

  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">About <span>Me</span></h2>
        <div className="about-content">
          <div className="about-text">
            <p className="about-bio">
              {profile.bio_about || "Welcome to my portfolio!"}
            </p>

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

            <div style={{ marginTop: '20px' }}>
              <SocialLinks className="about-socials" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
