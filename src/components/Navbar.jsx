// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { theme } = useTheme();

  // Apply theme whenever ThemeContext loads theme data
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const dark = storedTheme === 'light' ? false : true;
    setIsDark(dark);
    applyTheme(dark, theme);
  }, [theme]); // re-runs when theme loads from DB

  const applyTheme = (dark, themeData) => {
    const root = document.documentElement;

    if (themeData) {
      if (dark) {
        root.style.setProperty('--bg-primary', themeData.dark_bg_primary);
        root.style.setProperty('--bg-secondary', themeData.dark_bg_secondary);
        root.style.setProperty('--bg-accent', themeData.dark_accent);
        root.style.setProperty('--text-primary', themeData.dark_text_primary);
        root.style.setProperty('--text-secondary', themeData.dark_text_secondary);
        root.style.setProperty('--text-accent', themeData.dark_accent);
      } else {
        root.style.setProperty('--bg-primary', themeData.light_bg_primary);
        root.style.setProperty('--bg-secondary', themeData.light_bg_secondary);
        root.style.setProperty('--bg-accent', themeData.light_accent);
        root.style.setProperty('--text-primary', themeData.light_text_primary);
        root.style.setProperty('--text-secondary', themeData.light_text_secondary);
        root.style.setProperty('--text-accent', themeData.light_accent);
      }
    } else {
      // Fallback defaults if DB theme not loaded yet
      if (dark) {
        root.style.setProperty('--bg-primary', '#0a0a0a');
        root.style.setProperty('--bg-secondary', '#1a1a1a');
        root.style.setProperty('--bg-accent', '#6366f1');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#9ca3af');
        root.style.setProperty('--text-accent', '#818cf8');
      } else {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f3f4f6');
        root.style.setProperty('--bg-accent', '#6366f1');
        root.style.setProperty('--text-primary', '#111827');
        root.style.setProperty('--text-secondary', '#4b5563');
        root.style.setProperty('--text-accent', '#6366f1');
      }
    }

    root.style.setProperty('--border-color', dark ? '#2d2d2d' : '#e5e7eb');
    root.style.setProperty('--shadow', dark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)');
  };

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    applyTheme(newMode, theme);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Portfolio<span className="accent-dot">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop">
          <a href="#home">Home</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="nav-links mobile">
            <a href="#skills" onClick={() => setIsOpen(false)}>Skills</a>
            <a href="#projects" onClick={() => setIsOpen(false)}>Projects</a>
            <a href="#about" onClick={() => setIsOpen(false)}>About</a>
            <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
            <button
              onClick={() => { toggleTheme(); setIsOpen(false); }}
              className="theme-toggle mobile"
            >
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;