export type Language = 'en' | 'zh';

export type DurationType = 'weekly' | 'monthly' | 'yearly';

export interface Treat {
  id: string;
  name: string;
  emoji: string;
  monthlyCap: number;
  createdAt: string;
}

export interface RewardRule {
  checkInsRequired: number; // e.g. 3 check-ins
  treatsEarned: number;      // e.g. 1 treat
  treatId: string;           // linked treat ID
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  durationType: DurationType;
  target: number; // e.g. 3 per week, 12 per month, 100 per year
  startDate: string; // YYYY-MM-DD
  rewardRule?: RewardRule; // Optional: can be deleted/removed if unwanted
  isArchived: boolean;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  goalId: string;
  date: string; // YYYY-MM-DD
  isBackfill: boolean;
  createdAt: string;
}

export interface Redemption {
  id: string;
  treatId: string;
  date: string; // YYYY-MM-DD
  isExtra: boolean; // logged as extra treat if no balance or over monthly cap
  note?: string;
  createdAt: string;
}

export type AchievementType = 'goal_achieved' | 'milestone_25' | 'milestone_50' | 'milestone_75' | 'treat_earned';

export interface Achievement {
  id: string;
  goalId?: string;
  treatId?: string;
  type: AchievementType;
  periodKey: string; // e.g. "2026-W40", "2026-09", "2026"
  periodLabel: string;
  title: string;
  message: string;
  totalCheckIns: number;
  target?: number;
  treatsEarned: number;
  unlockedAt: string;
  goalName?: string;
  goalEmoji?: string;
  treatName?: string;
  treatEmoji?: string;
}

export interface TreatStats {
  earnedThisMonth: number;
  redeemedThisMonth: number;
  extraRedeemedThisMonth: number;
  availableToRedeem: number;
  cap: number;
  isCapReached: boolean;
  isOverAchieving: boolean;
}

export interface CelebrationEvent {
  type: 'treat' | 'milestone' | 'goal';
  title: string;
  message: string;
  emoji: string;
  treatName?: string;
  goalName?: string;
  achievement?: Achievement;
}
