// src/utils/skillIcons.js
// Icon mapping for Skills section - SVG icons with official brand colors

import {
    // Programming Languages
    SiPython, SiJavascript, SiTypescript,
    // SiJava, SiCplusplus, SiC, SiPhp,
    SiRuby, SiGo, SiRust, SiSwift, SiKotlin,

    // Frontend Frameworks & Libraries
    SiReact, SiVuedotjs, SiAngular, SiSvelte, SiNextdotjs, SiNuxtdotjs,

    // Backend Frameworks
    SiNodedotjs, SiExpress, SiDjango, SiFlask, SiSpring, SiLaravel, SiRubyonrails,

    // Databases
    SiMongodb, SiPostgresql, SiMysql, SiRedis, SiSqlite, SiFirebase, SiSupabase,

    // Cloud & DevOps
    // SiAmazonaws, SiMicrosoftazure, SiGooglecloud, SiDocker, SiKubernetes,
    SiJenkins, SiGithubactions, SiVercel, SiNetlify, SiHeroku,

    // Tools & Others
    SiGit, SiGithub, SiGitlab, SiBitbucket, SiPostman, SiNpm, SiYarn,
    SiWebpack, SiVite,

    // CSS & Styling
    SiTailwindcss, SiBootstrap, SiSass, SiStyledcomponents, SiMui,

    // Testing
    SiJest, SiCypress, SiSelenium, SiPytest,

    // Others
    SiGraphql, SiApollographql, SiRedux, SiSocketdotio, SiElectron
} from 'react-icons/si';

import {
    FaCode, FaDatabase, FaServer, FaCloud, FaTools, FaPaintBrush,
    FaMobile, FaGamepad, FaRobot, FaBrain, FaChartLine, FaShieldAlt
} from 'react-icons/fa';

import {
    DiHtml5, DiCss3, DiSass, DiBootstrap, DiWordpress
} from 'react-icons/di';

import {
    TbBrandReactNative, TbBrandFlutter, TbApi, TbBrandFramerMotion
} from 'react-icons/tb';

// ==============================================
// ⭐ MAIN ICON MAP - With Official Brand Colors!
// ==============================================
export const skillIconMap = {
    // PROGRAMMING LANGUAGES
    'SiPython': { icon: SiPython, label: 'Python', category: 'Languages', color: '#3776AB' },
    'SiJavascript': { icon: SiJavascript, label: 'JavaScript', category: 'Languages', color: '#F7DF1E' },
    'SiTypescript': { icon: SiTypescript, label: 'TypeScript', category: 'Languages', color: '#3178C6' },
    // 'SiJava': { icon: SiJava, label: 'Java', category: 'Languages', color: '#007396' },
    // 'SiCplusplus': { icon: SiCplusplus, label: 'C++', category: 'Languages', color: '#00599C' },
    // 'SiC': { icon: SiC, label: 'C', category: 'Languages', color: '#A8B9CC' },
    // 'SiPhp': { icon: SiPhp, label: 'PHP', category: 'Languages', color: '#777BB4' },
    'SiRuby': { icon: SiRuby, label: 'Ruby', category: 'Languages', color: '#CC342D' },
    'SiGo': { icon: SiGo, label: 'Go', category: 'Languages', color: '#00ADD8' },
    'SiRust': { icon: SiRust, label: 'Rust', category: 'Languages', color: '#000000' },
    'SiSwift': { icon: SiSwift, label: 'Swift', category: 'Languages', color: '#FA7343' },
    'SiKotlin': { icon: SiKotlin, label: 'Kotlin', category: 'Languages', color: '#7F52FF' },

    // FRONTEND
    'SiReact': { icon: SiReact, label: 'React', category: 'Frontend', color: '#61DAFB' },
    'SiVuedotjs': { icon: SiVuedotjs, label: 'Vue.js', category: 'Frontend', color: '#4FC08D' },
    'SiAngular': { icon: SiAngular, label: 'Angular', category: 'Frontend', color: '#DD0031' },
    'SiSvelte': { icon: SiSvelte, label: 'Svelte', category: 'Frontend', color: '#FF3E00' },
    'SiNextdotjs': { icon: SiNextdotjs, label: 'Next.js', category: 'Frontend', color: '#000000' },
    'SiNuxtdotjs': { icon: SiNuxtdotjs, label: 'Nuxt.js', category: 'Frontend', color: '#00DC82' },
    'DiHtml5': { icon: DiHtml5, label: 'HTML5', category: 'Frontend', color: '#E34F26' },
    'DiCss3': { icon: DiCss3, label: 'CSS3', category: 'Frontend', color: '#1572B6' },

    // STYLING
    'SiTailwindcss': { icon: SiTailwindcss, label: 'Tailwind CSS', category: 'Styling', color: '#06B6D4' },
    'SiBootstrap': { icon: SiBootstrap, label: 'Bootstrap', category: 'Styling', color: '#7952B3' },
    'DiBootstrap': { icon: DiBootstrap, label: 'Bootstrap', category: 'Styling', color: '#7952B3' },
    'SiSass': { icon: SiSass, label: 'Sass', category: 'Styling', color: '#CC6699' },
    'DiSass': { icon: DiSass, label: 'Sass', category: 'Styling', color: '#CC6699' },
    'SiStyledcomponents': { icon: SiStyledcomponents, label: 'Styled Components', category: 'Styling', color: '#DB7093' },
    'SiMui': { icon: SiMui, label: 'Material-UI', category: 'Styling', color: '#007FFF' },
    'TbBrandFramerMotion': { icon: TbBrandFramerMotion, label: 'Framer Motion', category: 'Styling', color: '#0055FF' },

    // BACKEND
    'SiNodedotjs': { icon: SiNodedotjs, label: 'Node.js', category: 'Backend', color: '#339933' },
    'SiExpress': { icon: SiExpress, label: 'Express', category: 'Backend', color: '#000000' },
    'SiDjango': { icon: SiDjango, label: 'Django', category: 'Backend', color: '#092E20' },
    'SiFlask': { icon: SiFlask, label: 'Flask', category: 'Backend', color: '#000000' },
    'SiSpring': { icon: SiSpring, label: 'Spring Boot', category: 'Backend', color: '#6DB33F' },
    'SiLaravel': { icon: SiLaravel, label: 'Laravel', category: 'Backend', color: '#FF2D20' },
    'SiRubyonrails': { icon: SiRubyonrails, label: 'Ruby on Rails', category: 'Backend', color: '#CC0000' },

    // DATABASES
    'SiMongodb': { icon: SiMongodb, label: 'MongoDB', category: 'Database', color: '#47A248' },
    'SiPostgresql': { icon: SiPostgresql, label: 'PostgreSQL', category: 'Database', color: '#4169E1' },
    'SiMysql': { icon: SiMysql, label: 'MySQL', category: 'Database', color: '#4479A1' },
    'SiRedis': { icon: SiRedis, label: 'Redis', category: 'Database', color: '#DC382D' },
    'SiSqlite': { icon: SiSqlite, label: 'SQLite', category: 'Database', color: '#003B57' },
    'SiFirebase': { icon: SiFirebase, label: 'Firebase', category: 'Database', color: '#FFCA28' },
    'SiSupabase': { icon: SiSupabase, label: 'Supabase', category: 'Database', color: '#3ECF8E' },

    // CLOUD & DEVOPS
    // 'SiAmazonaws': { icon: SiAmazonaws, label: 'AWS', category: 'Cloud', color: '#FF9900' },
    // 'SiMicrosoftazure': { icon: SiMicrosoftazure, label: 'Azure', category: 'Cloud', color: '#0078D4' },
    // 'SiGooglecloud': { icon: SiGooglecloud, label: 'Google Cloud', category: 'Cloud', color: '#4285F4' },
    // 'SiDocker': { icon: SiDocker, label: 'Docker', category: 'DevOps', color: '#2496ED' },
    // 'SiKubernetes': { icon: SiKubernetes, label: 'Kubernetes', category: 'DevOps', color: '#326CE5' },
    'SiJenkins': { icon: SiJenkins, label: 'Jenkins', category: 'DevOps', color: '#D24939' },
    'SiGithubactions': { icon: SiGithubactions, label: 'GitHub Actions', category: 'DevOps', color: '#2088FF' },
    'SiVercel': { icon: SiVercel, label: 'Vercel', category: 'Cloud', color: '#000000' },
    'SiNetlify': { icon: SiNetlify, label: 'Netlify', category: 'Cloud', color: '#00C7B7' },
    'SiHeroku': { icon: SiHeroku, label: 'Heroku', category: 'Cloud', color: '#430098' },

    // TOOLS
    'SiGit': { icon: SiGit, label: 'Git', category: 'Tools', color: '#F05032' },
    'SiGithub': { icon: SiGithub, label: 'GitHub', category: 'Tools', color: '#4e4d4dff' },
    'SiGitlab': { icon: SiGitlab, label: 'GitLab', category: 'Tools', color: '#FC6D26' },
    'SiBitbucket': { icon: SiBitbucket, label: 'Bitbucket', category: 'Tools', color: '#0052CC' },
    'SiPostman': { icon: SiPostman, label: 'Postman', category: 'Tools', color: '#FF6C37' },
    'SiNpm': { icon: SiNpm, label: 'NPM', category: 'Tools', color: '#CB3837' },
    'SiYarn': { icon: SiYarn, label: 'Yarn', category: 'Tools', color: '#2C8EBB' },
    'SiWebpack': { icon: SiWebpack, label: 'Webpack', category: 'Tools', color: '#8DD6F9' },
    'SiVite': { icon: SiVite, label: 'Vite', category: 'Tools', color: '#646CFF' },
    'DiWordpress': { icon: DiWordpress, label: 'WordPress', category: 'Tools', color: '#21759B' },

    // TESTING
    'SiJest': { icon: SiJest, label: 'Jest', category: 'Testing', color: '#C21325' },
    'SiCypress': { icon: SiCypress, label: 'Cypress', category: 'Testing', color: '#17202C' },
    'SiSelenium': { icon: SiSelenium, label: 'Selenium', category: 'Testing', color: '#43B02A' },
    'SiPytest': { icon: SiPytest, label: 'Pytest', category: 'Testing', color: '#0A9EDC' },

    // MOBILE
    'TbBrandReactNative': { icon: TbBrandReactNative, label: 'React Native', category: 'Mobile', color: '#61DAFB' },
    'TbBrandFlutter': { icon: TbBrandFlutter, label: 'Flutter', category: 'Mobile', color: '#02569B' },

    // OTHERS
    'SiGraphql': { icon: SiGraphql, label: 'GraphQL', category: 'API', color: '#E10098' },
    'SiApollographql': { icon: SiApollographql, label: 'Apollo GraphQL', category: 'API', color: '#311C87' },
    'SiRedux': { icon: SiRedux, label: 'Redux', category: 'State Management', color: '#764ABC' },
    'SiSocketdotio': { icon: SiSocketdotio, label: 'Socket.io', category: 'Real-time', color: '#010101' },
    'SiElectron': { icon: SiElectron, label: 'Electron', category: 'Desktop', color: '#47848F' },
    'TbApi': { icon: TbApi, label: 'REST API', category: 'API', color: '#009688' },

    // GENERIC FALLBACK ICONS (with nice colors)
    'FaCode': { icon: FaCode, label: 'Code', category: 'Generic', color: '#6366f1' },
    'FaDatabase': { icon: FaDatabase, label: 'Database', category: 'Generic', color: '#10b981' },
    'FaServer': { icon: FaServer, label: 'Server', category: 'Generic', color: '#8b5cf6' },
    'FaCloud': { icon: FaCloud, label: 'Cloud', category: 'Generic', color: '#06b6d4' },
    'FaTools': { icon: FaTools, label: 'Tools', category: 'Generic', color: '#f59e0b' },
    'FaPaintBrush': { icon: FaPaintBrush, label: 'Design', category: 'Generic', color: '#ec4899' },
    'FaMobile': { icon: FaMobile, label: 'Mobile', category: 'Generic', color: '#3b82f6' },
    'FaGamepad': { icon: FaGamepad, label: 'Game Dev', category: 'Generic', color: '#8b5cf6' },
    'FaRobot': { icon: FaRobot, label: 'AI/ML', category: 'Generic', color: '#06b6d4' },
    'FaBrain': { icon: FaBrain, label: 'Machine Learning', category: 'Generic', color: '#8b5cf6' },
    'FaChartLine': { icon: FaChartLine, label: 'Data Science', category: 'Generic', color: '#10b981' },
    'FaShieldAlt': { icon: FaShieldAlt, label: 'Security', category: 'Generic', color: '#ef4444' },
};

// ==============================================
// 🔧 HOW TO ADD MORE ICONS:
// ==============================================
// 1. Import the icon from react-icons (search at https://react-icons.github.io/react-icons/)
// 2. Add it to the skillIconMap above with format:
//    'IconName': { icon: IconComponent, label: 'Display Name', category: 'Category', color: '#HexColor' }
// 
// Example:
// import { SiTensorflow } from 'react-icons/si';
// 'SiTensorflow': { icon: SiTensorflow, label: 'TensorFlow', category: 'AI/ML', color: '#FF6F00' },
//
// Find official brand colors at: https://brandcolors.net/
// ==============================================

// Helper function to get icon component with color
export const getSkillIcon = (iconKey) => {
    const iconData = skillIconMap[iconKey];
    return iconData || { icon: FaCode, color: '#6366f1' }; // Fallback
};

// Get all available icons for dropdown (sorted by category)
export const getAvailableIcons = () => {
    return Object.keys(skillIconMap).map(key => ({
        value: key,
        label: skillIconMap[key].label,
        category: skillIconMap[key].category,
        color: skillIconMap[key].color
    }));
};