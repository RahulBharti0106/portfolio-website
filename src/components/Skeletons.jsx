// src/components/Skeletons.jsx
import './Skeletons.css';

export function HeroSkeleton() {
  return (
    <div className="skeleton-hero">
      <div className="skeleton-card">
        <div className="skeleton-banner" />
        <div className="skeleton-body">
          <div className="skeleton-avatar" />
          <div className="skeleton-actions">
            <div className="skeleton-btn" />
            <div className="skeleton-btn" />
          </div>
          <div className="skeleton-identity">
            <div className="skeleton-line skeleton-line--name" />
            <div className="skeleton-line skeleton-line--tagline" />
            <div className="skeleton-line skeleton-line--bio" />
            <div className="skeleton-line skeleton-line--bio-short" />
          </div>
          <div className="skeleton-tags">
            <div className="skeleton-tag" />
            <div className="skeleton-tag" />
            <div className="skeleton-tag" />
          </div>
          <div className="skeleton-divider" />
          <div className="skeleton-socials">
            <div className="skeleton-social-icon" />
            <div className="skeleton-social-icon" />
            <div className="skeleton-social-icon" />
            <div className="skeleton-social-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <section className="skills-section">
      <h2 className="section-title">My <span>Skills</span></h2>
      <div className="skeleton-skills-track">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-skill-card">
            <div className="skeleton-skill-icon" />
            <div className="skeleton-line skeleton-line--skill-name" />
            <div className="skeleton-skill-tags">
              <div className="skeleton-tag" />
              <div className="skeleton-tag" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSkeleton() {
  return (
    <section className="prj-section">
      <div className="prj-header">
        <span className="prj-eyebrow">Curated Engineering</span>
        <div className="prj-title-row">
          <h2 className="prj-title">Featured Projects</h2>
          <div className="prj-title-line" />
        </div>
      </div>
      <div className="skeleton-projects-rail">
        {[1, 2].map((i) => (
          <div key={i} className="skeleton-project-card">
            <div className="skeleton-project-img" />
            <div className="skeleton-project-body">
              <div className="skeleton-line skeleton-line--project-title" />
              <div className="skeleton-line skeleton-line--bio" />
              <div className="skeleton-line skeleton-line--bio-short" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}