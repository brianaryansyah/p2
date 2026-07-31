import { useCallback, useEffect, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const SITE_SETTINGS_STORAGE_KEY = 'site_settings_v1';

const DEFAULTS = {
  version: 1,
  profile: {
    name: PORTFOLIO_DATA.profile.name,
    role: PORTFOLIO_DATA.profile.role,
    location: PORTFOLIO_DATA.profile.location,
    email: PORTFOLIO_DATA.profile.email,
    bio: PORTFOLIO_DATA.profile.bio,
    socials: { ...PORTFOLIO_DATA.profile.socials },
  },
  photo: {
    dataUrl: null,
    updatedAt: null,
  },
};

const deepMerge = (base, override) => {
  if (!override || typeof override !== 'object') return base;
  const result = { ...base };
  Object.keys(override).forEach((key) => {
    if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
      result[key] = deepMerge(result[key] || {}, override[key]);
    } else if (override[key] !== undefined) {
      result[key] = override[key];
    }
  });
  return result;
};

const loadSettings = () => {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return deepMerge(DEFAULTS, JSON.parse(raw));
  } catch {
    return DEFAULTS;
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(loadSettings);

  // Keep the hook in sync across tabs (admin edits reflect instantly).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SITE_SETTINGS_STORAGE_KEY) {
        setSettings(loadSettings());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = deepMerge(prev, patch);
      try {
        window.localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage full or unavailable — keep in-memory state only.
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(SITE_SETTINGS_STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
    setSettings(DEFAULTS);
  }, []);

  return { settings, update, reset };
};
