import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const themeCache = useRef(null); // Cache theme data to avoid refetching

  // Load theme from Supabase ONCE on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();

        if (!error && data) {
          themeCache.current = data; // Cache the theme
        }

        // Get stored preference or default to dark
        const storedTheme = localStorage.getItem('theme');
        const isDarkMode = storedTheme === 'light' ? false : true;
        setIsDark(isDarkMode);
        applyTheme(isDarkMode);
      } catch (err) {
        console.warn('Theme load error:', err);
        // Fallback to localStorage
        const storedTheme = localStorage.getItem('theme');
        const isDarkMode = storedTheme === 'light' ? false : true;
        setIsDark(isDarkMode);
        applyTheme(isDarkMode);
      }
    };
    loadTheme();
  }, []);

  // Apply theme function - uses cached theme or defaults
  const applyTheme = (isDark) => {
    const root = document.documentElement;
    const themeData = themeCache.current;

    if (themeData) {
      // Use colors from cached Supabase theme
      if (isDark) {
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

      // Apply typography
      root.style.setProperty('--font-family', themeData.font_family);
      root.style.setProperty('--font-size-base', themeData.font_size + 'px');
    } else {
      // Fallback to default colors
      if (isDark) {
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

    // Set border color based on theme
    root.style.setProperty('--border-color', isDark ? '#2d2d2d' : '#e5e7eb');
    root.style.setProperty('--shadow', isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)');
  };

  // Toggle Handler - INSTANT (uses cached theme)
  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    applyTheme(newMode); // Uses cached theme, no API call
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

          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
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
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;