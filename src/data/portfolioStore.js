import { PROJECT_META } from './projectMeta';
import { PORTFOLIO_DATA } from './portfolioData';

// ─── Reactive Content Store ──────────────────────────────────────
// Single source of truth for the site's editable content. Base values are
// seeded from the code-defined data so the site looks identical until the
// admin overrides a section. Overrides persist to localStorage and sync
// across tabs. Used via the `usePortfolioData()` hook in components and the
// plain `getPortfolioData()` getter in non-React modules (AI context).

export const PORTFOLIO_CONTENT_STORAGE_KEY = 'portfolio_content_v1';

// Base defaults mirror the current hardcoded site content.
const BASE = {
  projects: PROJECT_META.map((m) => ({
    ...m,
    description: PORTFOLIO_DATA.projects.find((p) => p.slug === m.slug)?.description || '',
  })),
  experience: [
    {
      company: 'GDSC Udinus',
      role: 'Developer Community',
      period: 'Nov 2023 - Nov 2025',
      impact: 'Contributed to 5+ technical discussions across 4 collaborative projects.',
      stack: ['Community', 'Workshops', 'Collaboration'],
      description: [
        'Actively participated in workshops, technical events, and collaborative learning sessions.',
        'Contributed insights around development and analytics in community-driven projects.',
      ],
    },
    {
      company: 'Blockvizo',
      role: 'Data Analyst',
      period: 'Jun 2024 - Jul 2025',
      impact: 'Improved forecasting accuracy by 35% and cut analysis time by 40%.',
      stack: ['Data Analysis', 'Dashboards', 'Web3 Analytics', 'Predictive Modeling'],
      description: [
        'Processed 50,000+ game hash history records to model item-drop probability behavior.',
        'Built actionable dashboards for decentralized projects, enabling faster and more confident decisions.',
        'Specialized in predictive airdrop and winning probability analysis across 10+ Web3 ecosystems.',
      ],
    },
    {
      company: 'ASAH (led by Dicoding x Accenture)',
      role: 'Machine Learning Cohort',
      period: 'Aug 2025 - Jan 2026',
      impact: 'Served as project manager during the capstone phase and improved team execution by 70%.',
      stack: ['Project Leadership', 'ML Product', 'React', 'Stakeholder Sync'],
      description: [
        'Acted as project manager during capstone, leading a cross-functional team of 5 machine learning engineers and React developers.',
        'Managed the development of a banking sales prediction portal to prioritize high-probability leads and reduce low-value outreach.',
        'Coordinated timelines and technical workflows across functions to improve delivery speed and reliability.',
      ],
    },
    {
      company: 'Programming Lab',
      role: 'Lab Assistant',
      period: 'Aug 2025 - Present',
      impact: 'Mentored 110+ junior students through practical engineering sessions.',
      stack: ['Teaching', 'Mentorship', 'Software Fundamentals'],
      description: [
        'Assisted in 3+ weekly academic lab sessions for programming and software engineering courses.',
        'Mentored around 110 junior students in problem solving, practical exercises, and core programming concepts.',
      ],
    },
    {
      company: 'PIJAK (led by Dicoding x IBM)',
      role: 'AI Engineer Cohort',
      period: 'Jan 2026 - Present',
      impact: 'Selected participant in the PIJAK AI Engineer cohort.',
      stack: ['Python', 'Generative AI', 'Deep Learning', 'AI Ethics'],
      description: [
        'Joined an intensive AI Engineer cohort focused on Generative AI, Deep Learning, and AI Ethics.',
        'Developing advanced AI solutions with Python and industry-standard practices from the IBM SkillsBuild curriculum.',
        'Building capstone-ready systems for real-world AI implementation challenges.',
      ],
    },
  ],
  techStack: [
    {
      title: 'AI & Machine Learning',
      description: 'Intelligent systems & models',
      skills: [
        { name: 'Python' },
        { name: 'TensorFlow' },
        { name: 'PyTorch' },
        { name: 'Keras' },
        { name: 'Scikit-Learn' },
        { name: 'OpenCV' },
        { name: 'Streamlit' },
        { name: 'Numpy' },
        { name: 'Pandas' },
        { name: 'RAG' },
        { name: 'LLM' },
      ],
    },
    {
      title: 'Frontend Eng.',
      description: 'Interactive web interfaces',
      skills: [
        { name: 'React' },
        { name: 'Next.js' },
        { name: 'Tailwind CSS' },
        { name: 'GSAP' },
        { name: 'JavaScript' },
        { name: 'HTML/CSS' },
      ],
    },
    {
      title: 'Backend & API',
      description: 'Scalable server architectures',
      skills: [
        { name: 'FastAPI' },
        { name: 'ExpressJS' },
        { name: 'PostgreSQL' },
        { name: 'MySQL' },
        { name: 'Supabase' },
        { name: 'REST APIs' },
      ],
    },
    {
      title: 'DevOps & Cloud',
      description: 'Infrastructure & deployment',
      skills: [
        { name: 'Docker' },
        { name: 'Microsoft Azure' },
        { name: 'MLOps' },
        { name: 'Git' },
        { name: 'Linux' },
      ],
    },
  ],
  capabilities: [
    { title: 'Machine Learning', desc: 'Predictive modeling, regression, and algorithmic classification built for scale.' },
    { title: 'Deep Learning', desc: 'Neural architectures for complex pattern recognition and high-accuracy deployments.' },
    { title: 'Computer Vision', desc: 'Image processing, real-time object detection, and robust spatial analytics.' },
    { title: 'NLP & GenAI', desc: 'Large language models, semantic analysis, and human-like conversational AI.' },
    { title: 'MLOps', desc: 'End-to-end model deployment frameworks, continuous monitoring, and automation.' },
    { title: 'Data Analysis', desc: 'Advanced statistical modeling, big data wrangling, and actionable visualizations.' },
    { title: 'Web Engineering', desc: 'Scalable full-stack systems with ultra-responsive, accessible interfaces.' },
  ],
  achievements: PORTFOLIO_DATA.achievements || [],
  profile: PORTFOLIO_DATA.profile,
};

const listeners = new Set();

function loadOverrides() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_CONTENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

let overrides = loadOverrides();
let cached = null;
let cachedOverrides = overrides;

export function getPortfolioData() {
  if (cached && cachedOverrides === overrides) return cached;
  const data = {};
  for (const key of Object.keys(BASE)) {
    data[key] = overrides[key] !== undefined ? overrides[key] : BASE[key];
  }
  cached = data;
  cachedOverrides = overrides;
  return cached;
}

export function setPortfolioSection(key, value) {
  overrides = { ...overrides, [key]: value };
  persist();
  emit();
}

export function setPortfolioData(patch) {
  overrides = { ...overrides, ...patch };
  persist();
  emit();
}

export function resetPortfolioData() {
  overrides = {};
  cached = null;
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(PORTFOLIO_CONTENT_STORAGE_KEY);
  }
  emit();
}

function persist() {
  try {
    window.localStorage.setItem(PORTFOLIO_CONTENT_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // storage quota or private mode — ignore
  }
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribePortfolio(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === PORTFOLIO_CONTENT_STORAGE_KEY) {
      overrides = loadOverrides();
      cached = null;
      emit();
    }
  });
}
