import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

function SocialLinks({ className = '' }) {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        // Safety check for supabase
        if (!supabase) return;

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
    };

    if (!links || links.length === 0) return null;

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
            {links.map(link => {
                const Icon = iconMap[link.icon] || FiMail;
                return (
                    <a
                        key={link.id}
                        href={link.url}
                        target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        aria-label={link.platform}
                        style={{ margin: '0 0.5rem', color: 'inherit' }}
                    >
                        <Icon size={24} />
                    </a>
                );
            })}
        </div>
    );
}

export default SocialLinks;
