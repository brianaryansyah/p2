import { PORTFOLIO_DATA } from './portfolioData';

// ─── Reactive Content Store ──────────────────────────────────────
// Single source of truth for the site's editable content. Base values are
// seeded from the code-defined data so the site looks identical until the
// admin overrides a section. Overrides persist to localStorage and sync
// across tabs. Used via the `usePortfolioData()` hook in components and the
// plain `getPortfolioData()` getter in non-React modules (AI context).

export const PORTFOLIO_CONTENT_STORAGE_KEY = 'portfolio_content_v1';

// Base defaults mirror the current hardcoded site content. Collection
// sections (projects, experience, achievements) start empty so the owner can
// populate them through the /admin panel.
const BASE = {
  projects: [],
  experience: [],
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
  achievements: [],
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

// Profile is also managed by the admin's Profile tab via `useSiteSettings`
// (separate storage key). This merges that override so non-React modules
// (AI context, chat terminal) always read the current identity.
export function getLiveProfile() {
  const { profile } = getPortfolioData();
  if (typeof window === 'undefined') return profile;
  try {
    const raw = window.localStorage.getItem('site_settings_v1');
    if (!raw) return profile;
    const settings = JSON.parse(raw);
    const override = settings?.profile;
    if (!override) return profile;
    return {
      ...profile,
      ...override,
      socials: { ...profile.socials, ...(override.socials || {}) },
    };
  } catch {
    return profile;
  }
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
