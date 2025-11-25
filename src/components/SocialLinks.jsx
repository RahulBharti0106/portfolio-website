import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

function SocialLinks({ className = '' }) {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        supabase
            .from('social_links')
            .select('*')
            .eq('visible', true)
            .then(({ data }) => setLinks(data || []));
    }, []);

    const iconMap = {
        FiGithub: FiGithub,
        FiLinkedin: FiLinkedin,
        FiMail: FiMail,
        // Add other icons as used in your Supabase table
    };

    // Render mailto, normal link, with icon
    return (
        <div className={className}>
            {links.map(link => {
                const Icon = iconMap[link.icon] || FiMail;
                return (
                    <a
                        key={link.id}
                        href={link.url}
                        target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        aria-label={link.platform}
                        style={{ margin: '0 0.5rem' }}
                    >
                        <Icon size={24} />
                    </a>
                );
            })}
        </div>
    );
}

export default SocialLinks;
