// src/utils/skillIcons.js
// Icon mapping for Skills section - Replace emojis with SVG icons

import {
    // Programming Languages
    SiPython, SiJavascript, SiTypescript,
    SiRuby, SiGo, SiRust, SiSwift, SiKotlin,

    // Frontend Frameworks & Libraries
    SiReact, SiVuedotjs, SiAngular, SiSvelte, SiNextdotjs, SiNuxtdotjs,

    // Backend Frameworks
    SiNodedotjs, SiExpress, SiDjango, SiFlask, SiSpring, SiLaravel, SiRubyonrails,

    // Databases
    SiMongodb, SiPostgresql, SiMysql, SiRedis, SiSqlite, SiFirebase, SiSupabase,

    // Cloud & DevOps

    SiJenkins, SiGithubactions, SiVercel, SiNetlify, SiHeroku,

    // Tools & Others
    SiGit, SiGithub, SiGitlab, SiBitbucket,
    SiAdobexd, SiSketch, SiPostman, SiNpm, SiYarn, SiWebpack, SiVite,

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
// ⭐ MAIN ICON MAP - Add new icons here easily!
// ==============================================
export const skillIconMap = {
    // PROGRAMMING LANGUAGES
    'SiPython': { icon: SiPython, label: 'Python', category: 'Languages' },
    'SiJavascript': { icon: SiJavascript, label: 'JavaScript', category: 'Languages' },
    'SiTypescript': { icon: SiTypescript, label: 'TypeScript', category: 'Languages' },

    // FRONTEND
    'SiReact': { icon: SiReact, label: 'React', category: 'Frontend' },
    'SiVuedotjs': { icon: SiVuedotjs, label: 'Vue.js', category: 'Frontend' },
    'SiAngular': { icon: SiAngular, label: 'Angular', category: 'Frontend' },
    'SiSvelte': { icon: SiSvelte, label: 'Svelte', category: 'Frontend' },
    'SiNextdotjs': { icon: SiNextdotjs, label: 'Next.js', category: 'Frontend' },
    'SiNuxtdotjs': { icon: SiNuxtdotjs, label: 'Nuxt.js', category: 'Frontend' },
    'DiHtml5': { icon: DiHtml5, label: 'HTML5', category: 'Frontend' },
    'DiCss3': { icon: DiCss3, label: 'CSS3', category: 'Frontend' },

    // STYLING
    'SiTailwindcss': { icon: SiTailwindcss, label: 'Tailwind CSS', category: 'Styling' },
    'SiBootstrap': { icon: SiBootstrap, label: 'Bootstrap', category: 'Styling' },
    'DiBootstrap': { icon: DiBootstrap, label: 'Bootstrap', category: 'Styling' },
    'SiSass': { icon: SiSass, label: 'Sass', category: 'Styling' },
    'DiSass': { icon: DiSass, label: 'Sass', category: 'Styling' },
    'SiStyledcomponents': { icon: SiStyledcomponents, label: 'Styled Components', category: 'Styling' },
    'SiMui': { icon: SiMui, label: 'Material-UI', category: 'Styling' },
    'TbBrandFramerMotion': { icon: TbBrandFramerMotion, label: 'Framer Motion', category: 'Styling' },

    // BACKEND
    'SiNodedotjs': { icon: SiNodedotjs, label: 'Node.js', category: 'Backend' },
    'SiExpress': { icon: SiExpress, label: 'Express', category: 'Backend' },
    'SiDjango': { icon: SiDjango, label: 'Django', category: 'Backend' },
    'SiFlask': { icon: SiFlask, label: 'Flask', category: 'Backend' },
    'SiSpring': { icon: SiSpring, label: 'Spring Boot', category: 'Backend' },
    'SiLaravel': { icon: SiLaravel, label: 'Laravel', category: 'Backend' },
    'SiRubyonrails': { icon: SiRubyonrails, label: 'Ruby on Rails', category: 'Backend' },

    // DATABASES
    'SiMongodb': { icon: SiMongodb, label: 'MongoDB', category: 'Database' },
    'SiPostgresql': { icon: SiPostgresql, label: 'PostgreSQL', category: 'Database' },
    'SiMysql': { icon: SiMysql, label: 'MySQL', category: 'Database' },
    'SiRedis': { icon: SiRedis, label: 'Redis', category: 'Database' },
    'SiSqlite': { icon: SiSqlite, label: 'SQLite', category: 'Database' },
    'SiFirebase': { icon: SiFirebase, label: 'Firebase', category: 'Database' },
    'SiSupabase': { icon: SiSupabase, label: 'Supabase', category: 'Database' },

    // CLOUD & DEVOPS

    'SiJenkins': { icon: SiJenkins, label: 'Jenkins', category: 'DevOps' },
    'SiGithubactions': { icon: SiGithubactions, label: 'GitHub Actions', category: 'DevOps' },
    'SiVercel': { icon: SiVercel, label: 'Vercel', category: 'Cloud' },
    'SiNetlify': { icon: SiNetlify, label: 'Netlify', category: 'Cloud' },
    'SiHeroku': { icon: SiHeroku, label: 'Heroku', category: 'Cloud' },

    // TOOLS
    'SiGit': { icon: SiGit, label: 'Git', category: 'Tools' },
    'SiGithub': { icon: SiGithub, label: 'GitHub', category: 'Tools' },
    'SiGitlab': { icon: SiGitlab, label: 'GitLab', category: 'Tools' },
    'SiBitbucket': { icon: SiBitbucket, label: 'Bitbucket', category: 'Tools' },

    'SiAdobexd': { icon: SiAdobexd, label: 'Adobe XD', category: 'Design' },
    'SiSketch': { icon: SiSketch, label: 'Sketch', category: 'Design' },
    'SiPostman': { icon: SiPostman, label: 'Postman', category: 'Tools' },
    'SiNpm': { icon: SiNpm, label: 'NPM', category: 'Tools' },
    'SiYarn': { icon: SiYarn, label: 'Yarn', category: 'Tools' },
    'SiWebpack': { icon: SiWebpack, label: 'Webpack', category: 'Tools' },
    'SiVite': { icon: SiVite, label: 'Vite', category: 'Tools' },
    'DiWordpress': { icon: DiWordpress, label: 'WordPress', category: 'Tools' },

    // TESTING
    'SiJest': { icon: SiJest, label: 'Jest', category: 'Testing' },
    'SiCypress': { icon: SiCypress, label: 'Cypress', category: 'Testing' },
    'SiSelenium': { icon: SiSelenium, label: 'Selenium', category: 'Testing' },
    'SiPytest': { icon: SiPytest, label: 'Pytest', category: 'Testing' },

    // MOBILE
    'TbBrandReactNative': { icon: TbBrandReactNative, label: 'React Native', category: 'Mobile' },
    'TbBrandFlutter': { icon: TbBrandFlutter, label: 'Flutter', category: 'Mobile' },

    // OTHERS
    'SiGraphql': { icon: SiGraphql, label: 'GraphQL', category: 'API' },
    'SiApollographql': { icon: SiApollographql, label: 'Apollo GraphQL', category: 'API' },
    'SiRedux': { icon: SiRedux, label: 'Redux', category: 'State Management' },
    'SiSocketdotio': { icon: SiSocketdotio, label: 'Socket.io', category: 'Real-time' },
    'SiElectron': { icon: SiElectron, label: 'Electron', category: 'Desktop' },
    'TbApi': { icon: TbApi, label: 'REST API', category: 'API' },

    // GENERIC FALLBACK ICONS
    'FaCode': { icon: FaCode, label: 'Code', category: 'Generic' },
    'FaDatabase': { icon: FaDatabase, label: 'Database', category: 'Generic' },
    'FaServer': { icon: FaServer, label: 'Server', category: 'Generic' },
    'FaCloud': { icon: FaCloud, label: 'Cloud', category: 'Generic' },
    'FaTools': { icon: FaTools, label: 'Tools', category: 'Generic' },
    'FaPaintBrush': { icon: FaPaintBrush, label: 'Design', category: 'Generic' },
    'FaMobile': { icon: FaMobile, label: 'Mobile', category: 'Generic' },
    'FaGamepad': { icon: FaGamepad, label: 'Game Dev', category: 'Generic' },
    'FaRobot': { icon: FaRobot, label: 'AI/ML', category: 'Generic' },
    'FaBrain': { icon: FaBrain, label: 'Machine Learning', category: 'Generic' },
    'FaChartLine': { icon: FaChartLine, label: 'Data Science', category: 'Generic' },
    'FaShieldAlt': { icon: FaShieldAlt, label: 'Security', category: 'Generic' },
};

// ==============================================
// 🔧 HOW TO ADD MORE ICONS:
// ==============================================
// 1. Import the icon from react-icons (search at https://react-icons.github.io/react-icons/)
// 2. Add it to the skillIconMap above with format:
//    'IconName': { icon: IconComponent, label: 'Display Name', category: 'Category' }
// 
// Example:
// import { SiTensorflow } from 'react-icons/si';
// 'SiTensorflow': { icon: SiTensorflow, label: 'TensorFlow', category: 'AI/ML' },
// ==============================================

// Helper function to get icon component
export const getSkillIcon = (iconKey) => {
    const iconData = skillIconMap[iconKey];
    return iconData ? iconData.icon : FaCode; // Fallback to generic code icon
};

// Get all available icons for dropdown (sorted by category)
export const getAvailableIcons = () => {
    return Object.keys(skillIconMap).map(key => ({
        value: key,
        label: skillIconMap[key].label,
        category: skillIconMap[key].category
    }));
};