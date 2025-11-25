import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Theme.css';

function AdminTheme() {
  // Temp (preview) and published theme state
  const [theme, setTheme] = useState({
    primary_color: '#ffffff',
    secondary_color: '#f8f9fa',
    font_family: 'inherit',
    font_size: 16,
  });
  const [loading, setLoading] = useState(true);

  // Load current published theme from Supabase
  useEffect(() => {
    const fetchTheme = async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_active', true)
        .single();
      if (!error && data) setTheme(data);
      setLoading(false);
    };
    fetchTheme();
  }, []);

  // Preview: applies to admin layout only (not public site)
  useEffect(() => {
    document.documentElement.style.setProperty('--bg-primary', theme.primary_color);
    document.documentElement.style.setProperty('--bg-secondary', theme.secondary_color);
    document.documentElement.style.setProperty('--font-family', theme.font_family);
    document.documentElement.style.setProperty('--font-size-base', theme.font_size + 'px');
    // On unmount, reset (optional)
    return () => {
      document.documentElement.style.removeProperty('--bg-primary');
      document.documentElement.style.removeProperty('--bg-secondary');
      document.documentElement.style.removeProperty('--font-family');
      document.documentElement.style.removeProperty('--font-size-base');
    }
  }, [theme]);

  const handleChange = (field, value) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  // Publish: saves as active theme to Supabase
  const publishTheme = async () => {
    setLoading(true);
    try {
      // Deactivate all themes
      await supabase.from('themes').update({ is_active: false });
      // Activate/update this theme, or insert if none exists
      let result = await supabase.from('themes').select('id').eq('id', theme.id).single();
      if (result.data?.id) {
        await supabase.from('themes').update({ ...theme, is_active: true }).eq('id', theme.id);
      } else {
        await supabase.from('themes').insert([{ ...theme, is_active: true }]);
      }
      toast.success('Theme published!');
    } catch (err) {
      toast.error('Failed to publish!');
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="theme-customizer">
        <h1>Theme Customizer</h1>
        <div>
          <label>Primary Color</label>
          <input type="color" value={theme.primary_color} onChange={e => handleChange('primary_color', e.target.value)} />
        </div>
        <div>
          <label>Secondary Color</label>
          <input type="color" value={theme.secondary_color} onChange={e => handleChange('secondary_color', e.target.value)} />
        </div>
        <div>
          <label>Font Family</label>
          <input type="text" value={theme.font_family} onChange={e => handleChange('font_family', e.target.value)} />
        </div>
        <div>
          <label>Font Size (px)</label>
          <input type="number" min={12} max={40} value={theme.font_size} onChange={e => handleChange('font_size', parseInt(e.target.value) || 16)} />
        </div>
        <button className="btn btn-primary" onClick={publishTheme} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Theme'}
        </button>
      </div>
    </AdminLayout>
  );
}

export default AdminTheme;
