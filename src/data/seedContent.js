// ─── Seed Content ─────────────────────────────────────────────────────────
// Default collection content for the editable store (portfolioStore.js). These
// collections (projects, experience, achievements) start empty in the store so
// the owner can fully control them — but seeding them from the code-defined
// portfolio keeps the live site populated until an override is saved via /admin.
//
// Contents are recast from `portfolioData.js` into the exact shape the store
// and its renderers expect, so what you see equals what the admin CRUD edits.
import { PORTFOLIO_DATA } from './portfolioData';

export const SEED = {
  projects: PORTFOLIO_DATA.projects.map((project, index) => ({
    id: index + 1,
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    img: '',
    color: index % 2 === 0 ? 'bg-lime-400' : 'bg-black',
  })),

  experience: PORTFOLIO_DATA.experience.map((entry) => {
    const [role = '', company = ''] = entry.title.split(' - ');
    const impact = entry.description[0] || '';
    return {
      company: (company || entry.title).trim(),
      role: role.trim(),
      period: entry.period,
      impact,
      description: entry.description,
      stack: [],
    };
  }),

  achievements: PORTFOLIO_DATA.achievements.map((a) => ({
    title: a.title,
    project: a.project,
    description: a.description,
    team: a.team,
    track: a.track,
    techStack: a.techStack,
    links: { ...a.links },
  })),
};