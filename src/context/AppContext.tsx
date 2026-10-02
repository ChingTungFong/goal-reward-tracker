import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Goal,
  Treat,
  CheckIn,
  Redemption,
  Achievement,
  Language,
  TreatStats,
  CelebrationEvent,
  DurationType,
} from '../types';
import {
  getTodayDateString,
  getCurrentMonthString,
  getPeriodKey,
  getPeriodDateRange,
  getPeriodLabel,
  isDateWithinBackfillRange,
} from '../utils/dateUtils';
import { getRandomTemplate } from '../utils/templates';
import { generateDemoData } from '../utils/demoData';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  activeTab: 'today' | 'calendar' | 'treats' | 'goals';
  setActiveTab: (tab: 'today' | 'calendar' | 'treats' | 'goals') => void;
  
  // Data
  goals: Goal[];
  treats: Treat[];
  checkIns: CheckIn[];
  redemptions: Redemption[];
  achievements: Achievement[];
  
  // Goal CRUD
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => string;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  archiveGoal: (id: string) => void;
  unarchiveGoal: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Treat CRUD
  addTreat: (treat: Omit<Treat, 'id' | 'createdAt'>) => string;
  updateTreat: (id: string, treat: Partial<Treat>) => void;
  deleteTreat: (id: string) => void;

  // Reward Rule
  deleteGoalRewardRule: (goalId: string) => void;

  // Check-ins
  toggleCheckInToday: (goalId: string) => void;
  addBackfillCheckIn: (goalId: string, dateStr: string) => boolean;
  removeCheckIn: (checkInId: string) => void;
  isGoalCheckedInOnDate: (goalId: string, dateStr: string) => boolean;
  getCheckInForGoalOnDate: (goalId: string, dateStr: string) => CheckIn | undefined;

  // Redemptions
  redeemTreat: (treatId: string, isExtra: boolean, note?: string) => void;
  undoRedemption: (redemptionId: string) => void;

  // Stats & Helpers
  getTreatStats: (treatId: string, monthStr?: string) => TreatStats;
  getGoalCheckInsInPeriod: (goalId: string, date: Date, durationType: DurationType) => CheckIn[];
  isGoalAchievedInPeriod: (goal: Goal, date: Date) => boolean;

  // Modals & Celebrations
  celebration: CelebrationEvent | null;
  dismissCelebration: () => void;
  triggerConfetti: () => void;

  // UI Modals
  isTrophyShelfOpen: boolean;
  setIsTrophyShelfOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isWeeklyRecapOpen: boolean;
  setIsWeeklyRecapOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  // Data persistence & demo
  loadDemoData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEYS = {
  LANG: 'eyt_lang',
  GOALS: 'eyt_goals',
  TREATS: 'eyt_treats',
  CHECKINS: 'eyt_checkins',
  REDEMPTIONS: 'eyt_redemptions',
  ACHIEVEMENTS: 'eyt_achievements',
  ONBOARDING_SEEN: 'eyt_onboarding_seen',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'treats' | 'goals'>('today');

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [treats, setTreats] = useState<Treat[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TREATS);
    return saved ? JSON.parse(saved) : [];
  });

  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    return saved ? JSON.parse(saved) : [];
  });

  const [redemptions, setRedemptions] = useState<Redemption[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);
  const [isTrophyShelfOpen, setIsTrophyShelfOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWeeklyRecapOpen, setIsWeeklyRecapOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TREATS, JSON.stringify(treats));
  }, [treats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
  }, [redemptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#F43F5E', '#FB923C', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'],
      });
    } catch {
      // ignore
    }
  };

  const dismissCelebration = () => {
    setCelebration(null);
  };

  // Treat Stats calculation
  const getTreatStats = (treatId: string, monthStr: string = getCurrentMonthString()): TreatStats => {
    const treat = treats.find((t) => t.id === treatId);
    const cap = treat ? treat.monthlyCap : 5;

    // Check-ins in this month for goals rewarding this treat
    let earnedThisMonth = 0;
    goals.forEach((goal) => {
      if (goal.rewardRule && goal.rewardRule.treatId === treatId) {
        const monthCheckIns = checkIns.filter(
          (c) => c.goalId === goal.id && c.date.startsWith(monthStr)
        );
        const earned = Math.floor(monthCheckIns.length / goal.rewardRule.checkInsRequired) * goal.rewardRule.treatsEarned;
        earnedThisMonth += earned;
      }
    });

    // Redemptions in this month
    const standardRedemptions = redemptions.filter(
      (r) => r.treatId === treatId && !r.isExtra && r.date.startsWith(monthStr)
    );
    const extraRedemptions = redemptions.filter(
      (r) => r.treatId === treatId && r.isExtra && r.date.startsWith(monthStr)
    );

    const redeemedThisMonth = standardRedemptions.length;
    const extraRedeemedThisMonth = extraRedemptions.length;
    const availableToRedeem = Math.max(0, Math.min(earnedThisMonth, cap) - redeemedThisMonth);
    const isCapReached = redeemedThisMonth >= cap;
    const isOverAchieving = earnedThisMonth > cap;

    return {
      earnedThisMonth,
      redeemedThisMonth,
      extraRedeemedThisMonth,
      availableToRedeem,
      cap,
      isCapReached,
      isOverAchieving,
    };
  };

  const getGoalCheckInsInPeriod = (goalId: string, date: Date, durationType: DurationType): CheckIn[] => {
    const { start, end } = getPeriodDateRange(date, durationType);
    return checkIns.filter((c) => c.goalId === goalId && c.date >= start && c.date <= end);
  };

  const isGoalAchievedInPeriod = (goal: Goal, date: Date): boolean => {
    const count = getGoalCheckInsInPeriod(goal.id, date, goal.durationType).length;
    return count >= goal.target;
  };

  // Check for rewards & milestones when a check-in is added
  const evaluateMilestonesAndRewards = (
    goal: Goal,
    targetDateStr: string,
    updatedCheckIns: CheckIn[]
  ) => {
    const checkInDate = new Date(targetDateStr);
    const monthStr = targetDateStr.slice(0, 7);

    // 1. Reward check for the month (only if goal has a reward rule)
    if (goal.rewardRule) {
      const goalMonthCheckIns = updatedCheckIns.filter(
        (c) => c.goalId === goal.id && c.date.startsWith(monthStr)
      );
      const newMonthCount = goalMonthCheckIns.length;
      const oldMonthCount = newMonthCount - 1;

      const oldTreatsEarned = Math.floor(oldMonthCount / goal.rewardRule.checkInsRequired) * goal.rewardRule.treatsEarned;
      const newTreatsEarned = Math.floor(newMonthCount / goal.rewardRule.checkInsRequired) * goal.rewardRule.treatsEarned;

      const treat = treats.find((t) => t.id === goal.rewardRule!.treatId);

      if (newTreatsEarned > oldTreatsEarned && treat) {
        triggerConfetti();
        const message = getRandomTemplate('treat_earned', lang, {
          goalName: goal.name,
          goalEmoji: goal.emoji,
          treatName: treat.name,
          treatEmoji: treat.emoji,
        });

        const newAch: Achievement = {
          id: `ach-treat-${Date.now()}`,
          goalId: goal.id,
          treatId: treat.id,
          type: 'treat_earned',
          periodKey: monthStr,
          periodLabel: getPeriodLabel(monthStr, 'monthly', lang),
          title: message.title,
          message: message.body,
          totalCheckIns: newMonthCount,
          treatsEarned: newTreatsEarned - oldTreatsEarned,
          unlockedAt: new Date().toISOString(),
          goalName: goal.name,
          goalEmoji: goal.emoji,
          treatName: treat.name,
          treatEmoji: treat.emoji,
        };

        setAchievements((prev) => [newAch, ...prev]);

        setCelebration({
          type: 'treat',
          title: message.title,
          message: message.body,
          emoji: treat.emoji,
          treatName: treat.name,
          goalName: goal.name,
          achievement: newAch,
        });
        return; // Prioritize treat celebration
      }
    }

    // 2. Goal achievement & Milestone check for the current period
    const { start, end } = getPeriodDateRange(checkInDate, goal.durationType);
    const periodKey = getPeriodKey(checkInDate, goal.durationType);
    const periodLabel = getPeriodLabel(periodKey, goal.durationType, lang);

    const periodCheckIns = updatedCheckIns.filter(
      (c) => c.goalId === goal.id && c.date >= start && c.date <= end
    );
    const periodCount = periodCheckIns.length;

    const treatsEarnedInPeriod = goal.rewardRule
      ? Math.floor(periodCount / goal.rewardRule.checkInsRequired) * goal.rewardRule.treatsEarned
      : 0;
    const linkedTreat = goal.rewardRule
      ? treats.find((t) => t.id === goal.rewardRule!.treatId)
      : undefined;

    // Check if target was hit right now!
    if (periodCount === goal.target) {
      // Check if already awarded
      const alreadyAchieved = achievements.some(
        (a) => a.goalId === goal.id && a.periodKey === periodKey && a.type === 'goal_achieved'
      );
      if (!alreadyAchieved) {
        triggerConfetti();
        const message = getRandomTemplate('goal_achieved', lang, {
          goalName: goal.name,
          goalEmoji: goal.emoji,
          periodLabel,
          target: goal.target,
          totalCheckIns: periodCount,
          treatsEarned: treatsEarnedInPeriod,
        });

        const newAch: Achievement = {
          id: `ach-goal-${Date.now()}`,
          goalId: goal.id,
          treatId: linkedTreat?.id,
          type: 'goal_achieved',
          periodKey,
          periodLabel,
          title: message.title,
          message: message.body,
          totalCheckIns: periodCount,
          target: goal.target,
          treatsEarned: treatsEarnedInPeriod,
          unlockedAt: new Date().toISOString(),
          goalName: goal.name,
          goalEmoji: goal.emoji,
          treatName: linkedTreat?.name,
          treatEmoji: linkedTreat?.emoji,
        };

        setAchievements((prev) => [newAch, ...prev]);
        setCelebration({
          type: 'goal',
          title: message.title,
          message: message.body,
          emoji: '🏆',
          goalName: goal.name,
          achievement: newAch,
        });
        return;
      }
    }

    // 3. Milestones for monthly or yearly goals (25%, 50%, 75%)
    if ((goal.durationType === 'monthly' || goal.durationType === 'yearly') && goal.target >= 4) {
      const m25 = Math.ceil(goal.target * 0.25);
      const m50 = Math.ceil(goal.target * 0.50);
      const m75 = Math.ceil(goal.target * 0.75);

      let milestonePercent = 0;
      let milestoneType: Achievement['type'] | null = null;

      if (periodCount === m25) {
        milestonePercent = 25;
        milestoneType = 'milestone_25';
      } else if (periodCount === m50) {
        milestonePercent = 50;
        milestoneType = 'milestone_50';
      } else if (periodCount === m75) {
        milestonePercent = 75;
        milestoneType = 'milestone_75';
      }

      if (milestonePercent > 0 && milestoneType) {
        const alreadyAwarded = achievements.some(
          (a) => a.goalId === goal.id && a.periodKey === periodKey && a.type === milestoneType
        );
        if (!alreadyAwarded) {
          triggerConfetti();
          const message = getRandomTemplate('milestone_reached', lang, {
            goalName: goal.name,
            goalEmoji: goal.emoji,
            periodLabel,
            target: goal.target,
            totalCheckIns: periodCount,
            milestonePercent,
          });

          const newAch: Achievement = {
            id: `ach-mile-${Date.now()}`,
            goalId: goal.id,
            treatId: linkedTreat?.id,
            type: milestoneType,
            periodKey,
            periodLabel,
            title: message.title,
            message: message.body,
            totalCheckIns: periodCount,
            target: goal.target,
            treatsEarned: treatsEarnedInPeriod,
            unlockedAt: new Date().toISOString(),
            goalName: goal.name,
            goalEmoji: goal.emoji,
            treatName: linkedTreat?.name,
            treatEmoji: linkedTreat?.emoji,
          };

          setAchievements((prev) => [newAch, ...prev]);
          setCelebration({
            type: 'milestone',
            title: message.title,
            message: message.body,
            emoji: '🌟',
            goalName: goal.name,
            achievement: newAch,
          });
        }
      }
    }
  };

  // Check-ins
  const isGoalCheckedInOnDate = (goalId: string, dateStr: string): boolean => {
    return checkIns.some((c) => c.goalId === goalId && c.date === dateStr);
  };

  const getCheckInForGoalOnDate = (goalId: string, dateStr: string): CheckIn | undefined => {
    return checkIns.find((c) => c.goalId === goalId && c.date === dateStr);
  };

  const toggleCheckInToday = (goalId: string) => {
    const today = getTodayDateString();
    const existing = checkIns.find((c) => c.goalId === goalId && c.date === today);

    if (existing) {
      // Undo today's check-in
      setCheckIns((prev) => prev.filter((c) => c.id !== existing.id));
    } else {
      // Add check-in
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      const newCheckIn: CheckIn = {
        id: `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        goalId,
        date: today,
        isBackfill: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [...checkIns, newCheckIn];
      setCheckIns(updated);
      evaluateMilestonesAndRewards(goal, today, updated);
    }
  };

  const addBackfillCheckIn = (goalId: string, dateStr: string): boolean => {
    if (!isDateWithinBackfillRange(dateStr)) {
      return false;
    }
    const existing = checkIns.find((c) => c.goalId === goalId && c.date === dateStr);
    if (existing) {
      return false; // Already checked in
    }

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return false;

    const today = getTodayDateString();
    const isBackfill = dateStr < today;

    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      goalId,
      date: dateStr,
      isBackfill,
      createdAt: new Date().toISOString(),
    };

    const updated = [...checkIns, newCheckIn];
    setCheckIns(updated);
    evaluateMilestonesAndRewards(goal, dateStr, updated);
    return true;
  };

  const removeCheckIn = (checkInId: string) => {
    setCheckIns((prev) => prev.filter((c) => c.id !== checkInId));
  };

  // Redemptions
  const redeemTreat = (treatId: string, isExtra: boolean, note?: string) => {
    const newRedemption: Redemption = {
      id: `red-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      treatId,
      date: getTodayDateString(),
      isExtra,
      note,
      createdAt: new Date().toISOString(),
    };
    setRedemptions((prev) => [newRedemption, ...prev]);
    triggerConfetti();
  };

  const undoRedemption = (redemptionId: string) => {
    setRedemptions((prev) => prev.filter((r) => r.id !== redemptionId));
  };

  // Goal CRUD
  const addGoal = (newGoal: Omit<Goal, 'id' | 'createdAt'>): string => {
    const id = `goal-${Date.now()}`;
    const fullGoal: Goal = {
      ...newGoal,
      id,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, fullGoal]);
    return id;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const archiveGoal = (id: string) => {
    updateGoal(id, { isArchived: true });
  };

  const unarchiveGoal = (id: string) => {
    updateGoal(id, { isArchived: false });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const deleteGoalRewardRule = (goalId: string) => {
    updateGoal(goalId, { rewardRule: undefined });
  };

  // Treat CRUD
  const addTreat = (newTreat: Omit<Treat, 'id' | 'createdAt'>): string => {
    const id = `treat-${Date.now()}`;
    const fullTreat: Treat = {
      ...newTreat,
      id,
      createdAt: new Date().toISOString(),
    };
    setTreats((prev) => [...prev, fullTreat]);
    return id;
  };

  const updateTreat = (id: string, updates: Partial<Treat>) => {
    setTreats((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTreat = (id: string) => {
    setTreats((prev) => prev.filter((t) => t.id !== id));
    setGoals((prev) =>
      prev.map((g) =>
        g.rewardRule?.treatId === id ? { ...g, rewardRule: undefined } : g
      )
    );
  };

  // Demo data & storage
  const loadDemoData = () => {
    const demo = generateDemoData();
    setGoals(demo.goals);
    setTreats(demo.treats);
    setCheckIns(demo.checkIns);
    setRedemptions(demo.redemptions);
    setAchievements(demo.achievements);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
    setIsOnboardingOpen(false);
  };

  const clearAllData = () => {
    setGoals([]);
    setTreats([]);
    setCheckIns([]);
    setRedemptions([]);
    setAchievements([]);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.TREATS);
    localStorage.removeItem(STORAGE_KEYS.CHECKINS);
    localStorage.removeItem(STORAGE_KEYS.REDEMPTIONS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  };

  const exportDataJSON = (): string => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      goals,
      treats,
      checkIns,
      redemptions,
      achievements,
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed.goals) || !Array.isArray(parsed.treats)) {
        return false;
      }
      setGoals(parsed.goals);
      setTreats(parsed.treats);
      setCheckIns(parsed.checkIns || []);
      setRedemptions(parsed.redemptions || []);
      setAchievements(parsed.achievements || []);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        activeTab,
        setActiveTab,
        goals,
        treats,
        checkIns,
        redemptions,
        achievements,
        addGoal,
        updateGoal,
        archiveGoal,
        unarchiveGoal,
        deleteGoal,
        deleteGoalRewardRule,
        addTreat,
        updateTreat,
        deleteTreat,
        toggleCheckInToday,
        addBackfillCheckIn,
        removeCheckIn,
        isGoalCheckedInOnDate,
        getCheckInForGoalOnDate,
        redeemTreat,
        undoRedemption,
        getTreatStats,
        getGoalCheckInsInPeriod,
        isGoalAchievedInPeriod,
        celebration,
        dismissCelebration,
        triggerConfetti,
        isTrophyShelfOpen,
        setIsTrophyShelfOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isWeeklyRecapOpen,
        setIsWeeklyRecapOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        loadDemoData,
        clearAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
