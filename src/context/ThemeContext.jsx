// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTheme();
    }, []);

    const fetchTheme = async () => {
        try {
            const { data, error } = await supabase
                .from('themes')
                .select('*')
                .eq('is_active', true)
                .maybeSingle();

            if (data && !error) {
                setTheme(data);
                applyTheme(data);
            }
        } catch (err) {
            console.error('Theme fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (themeData) => {
        const root = document.documentElement;

        // Dark mode colors
        if (themeData.dark_bg_primary)
            root.style.setProperty('--dark-bg-primary', themeData.dark_bg_primary);
        if (themeData.dark_bg_secondary)
            root.style.setProperty('--dark-bg-secondary', themeData.dark_bg_secondary);
        if (themeData.dark_accent)
            root.style.setProperty('--dark-accent', themeData.dark_accent);
        if (themeData.dark_text_primary)
            root.style.setProperty('--dark-text-primary', themeData.dark_text_primary);
        if (themeData.dark_text_secondary)
            root.style.setProperty('--dark-text-secondary', themeData.dark_text_secondary);

        // Light mode colors
        if (themeData.light_bg_primary)
            root.style.setProperty('--light-bg-primary', themeData.light_bg_primary);
        if (themeData.light_bg_secondary)
            root.style.setProperty('--light-bg-secondary', themeData.light_bg_secondary);
        if (themeData.light_accent)
            root.style.setProperty('--light-accent', themeData.light_accent);
        if (themeData.light_text_primary)
            root.style.setProperty('--light-text-primary', themeData.light_text_primary);
        if (themeData.light_text_secondary)
            root.style.setProperty('--light-text-secondary', themeData.light_text_secondary);
    };

    return (
        <ThemeContext.Provider value={{ theme, loading }}>
            {children}
        </ThemeContext.Provider>
    );
}
