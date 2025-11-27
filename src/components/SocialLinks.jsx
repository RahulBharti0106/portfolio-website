import { useState, useEffect } from 'react';
// Check this path carefully!
import { supabase } from '../lib/supabase';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const SocialLinks = ({ className = '' }) => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        // Safety check: if supabase client fails, don't crash
        if (!supabase) return;

        const fetchLinks = async () => {
            try {
                const { data, error } = await supabase
                    .from('social_links')
                    .select('*')
                    .eq('visible', true);

                if (!error && data) {
                    setLinks(data);
                }
            } catch (err) {
                console.warn('Social links error:', err);
            }
        };

        fetchLinks();
    }, []);

    const iconMap = {
        FiGithub: FiGithub,
        FiLinkedin: FiLinkedin,
        FiMail: FiMail,
    };

    // Prevent rendering if no links
    if (!links || links.length === 0) return null;

    return (
        <div className={`social-links-container ${className}`}>
            {links.map((link) => {
                const Icon = iconMap[link.icon] || FiMail;
                return (
                    <a
                        key={link.id}
                        href={link.url}
                        target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        aria-label={link.platform || 'Social link'}
                        style={{ margin: '0 8px', display: 'inline-flex' }}
                    >
                        <Icon size={24} />
                    </a>
                );
            })}
        </div>
    );
};

export default SocialLinks;
