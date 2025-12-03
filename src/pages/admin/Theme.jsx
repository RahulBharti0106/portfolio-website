// src/pages/admin/Theme.jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Theme.css';

function AdminTheme() {
  const [theme, setTheme] = useState({
    // Dark Mode Colors
    dark_bg_primary: '#0a0a0a',
    dark_bg_secondary: '#1a1a1a',
    dark_accent: '#6366f1',
    dark_text_primary: '#ffffff',
    dark_text_secondary: '#9ca3af',
    // Light Mode Colors
    light_bg_primary: '#ffffff',
    light_bg_secondary: '#f3f4f6',
    light_accent: '#6366f1',
    light_text_primary: '#111827',
    light_text_secondary: '#4b5563'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [themeId, setThemeId] = useState(null);

  // Fetch active theme from Supabase
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();

        if (!error && data) {
          setTheme({
            dark_bg_primary: data.dark_bg_primary,
            dark_bg_secondary: data.dark_bg_secondary,
            dark_accent: data.dark_accent,
            dark_text_primary: data.dark_text_primary,
            dark_text_secondary: data.dark_text_secondary,
            light_bg_primary: data.light_bg_primary,
            light_bg_secondary: data.light_bg_secondary,
            light_accent: data.light_accent,
            light_text_primary: data.light_text_primary,
            light_text_secondary: data.light_text_secondary
          });
          setThemeId(data.id);
        }
      } catch (err) {
        console.error('Theme fetch error:', err);
        toast.error('Failed to load theme');
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);

  const handleChange = (field, value) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const publishTheme = async () => {
    setSaving(true);
    try {
      if (themeId) {
        // Update existing theme
        const { error } = await supabase
          .from('themes')
          .update({
            dark_bg_primary: theme.dark_bg_primary,
            dark_bg_secondary: theme.dark_bg_secondary,
            dark_accent: theme.dark_accent,
            dark_text_primary: theme.dark_text_primary,
            dark_text_secondary: theme.dark_text_secondary,
            light_bg_primary: theme.light_bg_primary,
            light_bg_secondary: theme.light_bg_secondary,
            light_accent: theme.light_accent,
            light_text_primary: theme.light_text_primary,
            light_text_secondary: theme.light_text_secondary,
            is_active: true
          })
          .eq('id', themeId);

        if (error) throw error;
      } else {
        // Insert new theme (deactivate others first)
        await supabase.from('themes').update({ is_active: false }).neq('id', 0);

        const { data, error } = await supabase
          .from('themes')
          .insert([{ ...theme, is_active: true }])
          .select()
          .single();

        if (error) throw error;
        setThemeId(data.id);
      }

      toast.success('✅ Theme published! Changes will appear on the main website.');
    } catch (err) {
      console.error('Publish error:', err);
      toast.error('Failed to publish theme: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading theme...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="theme-customizer">
        <h1>Theme Customizer</h1>
        <p className="subtitle">Customize colors for both Dark and Light modes on your main website</p>

        <div className="theme-grid">
          {/* DARK MODE SECTION */}
          <div className="theme-section">
            <h2>🌙 Dark Mode Colors</h2>

            <div className="color-input-group">
              <label>Background Primary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.dark_bg_primary}
                  onChange={(e) => handleChange('dark_bg_primary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.dark_bg_primary}
                  onChange={(e) => handleChange('dark_bg_primary', e.target.value)}
                  placeholder="#0a0a0a"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Background Secondary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.dark_bg_secondary}
                  onChange={(e) => handleChange('dark_bg_secondary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.dark_bg_secondary}
                  onChange={(e) => handleChange('dark_bg_secondary', e.target.value)}
                  placeholder="#1a1a1a"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Accent Color</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.dark_accent}
                  onChange={(e) => handleChange('dark_accent', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.dark_accent}
                  onChange={(e) => handleChange('dark_accent', e.target.value)}
                  placeholder="#6366f1"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Text Primary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.dark_text_primary}
                  onChange={(e) => handleChange('dark_text_primary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.dark_text_primary}
                  onChange={(e) => handleChange('dark_text_primary', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Text Secondary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.dark_text_secondary}
                  onChange={(e) => handleChange('dark_text_secondary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.dark_text_secondary}
                  onChange={(e) => handleChange('dark_text_secondary', e.target.value)}
                  placeholder="#9ca3af"
                />
              </div>
            </div>
          </div>

          {/* LIGHT MODE SECTION */}
          <div className="theme-section">
            <h2>☀️ Light Mode Colors</h2>

            <div className="color-input-group">
              <label>Background Primary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.light_bg_primary}
                  onChange={(e) => handleChange('light_bg_primary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.light_bg_primary}
                  onChange={(e) => handleChange('light_bg_primary', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Background Secondary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.light_bg_secondary}
                  onChange={(e) => handleChange('light_bg_secondary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.light_bg_secondary}
                  onChange={(e) => handleChange('light_bg_secondary', e.target.value)}
                  placeholder="#f3f4f6"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Accent Color</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.light_accent}
                  onChange={(e) => handleChange('light_accent', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.light_accent}
                  onChange={(e) => handleChange('light_accent', e.target.value)}
                  placeholder="#6366f1"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Text Primary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.light_text_primary}
                  onChange={(e) => handleChange('light_text_primary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.light_text_primary}
                  onChange={(e) => handleChange('light_text_primary', e.target.value)}
                  placeholder="#111827"
                />
              </div>
            </div>

            <div className="color-input-group">
              <label>Text Secondary</label>
              <div className="color-input">
                <input
                  type="color"
                  value={theme.light_text_secondary}
                  onChange={(e) => handleChange('light_text_secondary', e.target.value)}
                />
                <input
                  type="text"
                  value={theme.light_text_secondary}
                  onChange={(e) => handleChange('light_text_secondary', e.target.value)}
                  placeholder="#4b5563"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={publishTheme}
          disabled={saving}
          style={{ marginTop: '2rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {saving ? '⏳ Publishing...' : ' Publish Theme to Main Website'}
        </button>
      </div>
    </AdminLayout>
  );
}

export default AdminTheme;
