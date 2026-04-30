// src/components/Footer.jsx
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import { TbBrandTelegram } from 'react-icons/tb';
import './Footer.css';

function Footer() {
  const [footerData, setFooterData] = useState({
    brand_name: 'Portfolio',
    description: 'Building amazing digital experiences',
    show_product_column: true,
    product_column_title: 'Product',
    show_resources_column: true,
    resources_column_title: 'Resources',
    show_company_column: false,
    company_column_title: 'Company',
    copyright_text: 'All rights reserved.'
  });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [companyLinks, setCompanyLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        // Single call returns everything needed for the footer
        const data = await api.getFooter()
        if (data.settings) setFooterData(data.settings)
        setProjects(data.projects || [])
        setSkills(data.skills || [])
        setCompanyLinks(data.companyLinks || [])
        setSocialLinks(data.socialLinks || [])
      } catch (err) {
        console.error('Footer fetch error:', err)
      }
    }
    fetchFooter()
  }, []);

  const getSocialIcon = (iconName) => {
    const icons = {
      FiGithub, FiLinkedin, FiTwitter, FiInstagram, TbBrandTelegram,
    };
    return icons[iconName] || FiGithub;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Left Section - Brand & Social */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h3>{footerData.brand_name}</h3>
            </div>
            <p className="footer-description">{footerData.description}</p>

            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.icon);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      aria-label={link.platform}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Section - Columns */}
          <div className="footer-columns">
            {footerData.show_product_column && projects.length > 0 && (
              <div className="footer-column">
                <h4>{footerData.product_column_title}</h4>
                <ul>
                  {projects.map((project) => (
                    <li key={project.id}>
                      <a href="#projects">{project.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {footerData.show_resources_column && skills.length > 0 && (
              <div className="footer-column">
                <h4>{footerData.resources_column_title}</h4>
                <ul>
                  {skills.map((skill) => (
                    <li key={skill.id}>
                      <a href="#skills">{skill.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {footerData.show_company_column && companyLinks.length > 0 && (
              <div className="footer-column">
                <h4>{footerData.company_column_title}</h4>
                <ul>
                  {companyLinks.map((link) => (
                    <li key={link.id}>
                      <a href={link.url}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} {footerData.brand_name}. {footerData.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;