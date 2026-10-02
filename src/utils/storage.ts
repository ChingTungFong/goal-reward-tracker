import { Goal, Treat, CheckIn, Redemption, Achievement, Language } from '../types';

export const STORAGE_KEYS = {
  LANG: 'eyt_lang',
  GOALS: 'eyt_goals',
  TREATS: 'eyt_treats',
  CHECKINS: 'eyt_checkins',
  REDEMPTIONS: 'eyt_redemptions',
  ACHIEVEMENTS: 'eyt_achievements',
  ONBOARDING_SEEN: 'eyt_onboarding_seen',
} as const;

export const storage = {
  getLang: (): Language => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.LANG);
      return val === 'zh' ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  },

  setLang: (lang: Language): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {
      // ignore
    }
  },

  getGoals: (): Goal[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setGoals: (goals: Goal[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch {
      // ignore
    }
  },

  getTreats: (): Treat[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TREATS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setTreats: (treats: Treat[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TREATS, JSON.stringify(treats));
    } catch {
      // ignore
    }
  },

  getCheckIns: (): CheckIn[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKINS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setCheckIns: (checkIns: CheckIn[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkIns));
    } catch {
      // ignore
    }
  },

  getRedemptions: (): Redemption[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setRedemptions: (redemptions: Redemption[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
    } catch {
      // ignore
    }
  },

  getAchievements: (): Achievement[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setAchievements: (achievements: Achievement[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  },

  getOnboardingSeen: (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN) === 'true';
    } catch {
      return false;
    }
  },

  setOnboardingSeen: (seen: boolean = true): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, seen ? 'true' : 'false');
    } catch {
      // ignore
    }
  },

  clearAllData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.GOALS);
      localStorage.removeItem(STORAGE_KEYS.TREATS);
      localStorage.removeItem(STORAGE_KEYS.CHECKINS);
      localStorage.removeItem(STORAGE_KEYS.REDEMPTIONS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    } catch {
      // ignore
    }
  },
};
