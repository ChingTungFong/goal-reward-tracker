import { Goal, Treat, CheckIn, Redemption, Achievement } from '../types';
import { formatDateToISO } from './dateUtils';

export function generateDemoData(): {
  goals: Goal[];
  treats: Treat[];
  checkIns: CheckIn[];
  redemptions: Redemption[];
  achievements: Achievement[];
} {
  const now = new Date();
  
  const treats: Treat[] = [
    {
      id: 'treat-boba',
      name: 'Bubble Tea',
      emoji: '🧋',
      monthlyCap: 4,
      createdAt: new Date(now.getTime() - 65 * 86400000).toISOString(),
    },
    {
      id: 'treat-ramen',
      name: 'Japanese Ramen',
      emoji: '🍜',
      monthlyCap: 3,
      createdAt: new Date(now.getTime() - 65 * 86400000).toISOString(),
    },
    {
      id: 'treat-pastry',
      name: 'Weekend Pastry',
      emoji: '🥐',
      monthlyCap: 6,
      createdAt: new Date(now.getTime() - 65 * 86400000).toISOString(),
    },
  ];

  const goals: Goal[] = [
    {
      id: 'goal-gym',
      name: 'Gym & Workout',
      emoji: '🏋️',
      durationType: 'weekly',
      target: 3,
      startDate: formatDateToISO(new Date(now.getTime() - 60 * 86400000)),
      rewardRule: {
        checkInsRequired: 3,
        treatsEarned: 1,
        treatId: 'treat-boba',
      },
      isArchived: false,
      createdAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
    },
    {
      id: 'goal-read',
      name: 'Read 30 Mins',
      emoji: '📚',
      durationType: 'monthly',
      target: 15,
      startDate: formatDateToISO(new Date(now.getTime() - 60 * 86400000)),
      rewardRule: {
        checkInsRequired: 4,
        treatsEarned: 1,
        treatId: 'treat-pastry',
      },
      isArchived: false,
      createdAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
    },
    {
      id: 'goal-cook',
      name: 'Cook Dinner at Home',
      emoji: '🍳',
      durationType: 'weekly',
      target: 4,
      startDate: formatDateToISO(new Date(now.getTime() - 60 * 86400000)),
      rewardRule: {
        checkInsRequired: 4,
        treatsEarned: 1,
        treatId: 'treat-ramen',
      },
      isArchived: false,
      createdAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
    },
  ];

  const checkIns: CheckIn[] = [];
  const addCheckIn = (goalId: string, daysAgo: number, isBackfill: boolean = false) => {
    const d = new Date(now.getTime() - daysAgo * 86400000);
    const dateStr = formatDateToISO(d);
    checkIns.push({
      id: `checkin-${goalId}-${dateStr}`,
      goalId,
      date: dateStr,
      isBackfill,
      createdAt: d.toISOString(),
    });
  };

  // Generate realistic check-ins over the past 50 days
  // Goal: Gym (3 times a week)
  [48, 46, 44, 41, 39, 37, 34, 32, 30, 27, 25, 23, 20, 18, 16, 13, 11, 9, 6, 4, 1].forEach((daysAgo, idx) => {
    // Make one of recent ones a backfill to demonstrate the feature
    addCheckIn('goal-gym', daysAgo, idx === 19);
  });

  // Goal: Reading (regular daily/every other day)
  [49, 48, 47, 45, 44, 42, 40, 39, 38, 36, 35, 33, 31, 30, 28, 26, 24, 23, 21, 19, 18, 16, 15, 14, 12, 10, 8, 7, 5, 3, 2, 0].forEach((daysAgo) => {
    addCheckIn('goal-read', daysAgo, daysAgo === 3);
  });

  // Goal: Cook Dinner (3-4 times a week)
  [48, 47, 45, 42, 41, 39, 38, 35, 34, 32, 28, 27, 26, 24, 21, 20, 19, 17, 14, 13, 12, 10, 7, 6, 5, 2, 1].forEach((daysAgo) => {
    addCheckIn('goal-cook', daysAgo, false);
  });

  // Redemptions
  const redemptions: Redemption[] = [
    // Last month
    {
      id: 'red-1',
      treatId: 'treat-boba',
      date: formatDateToISO(new Date(now.getTime() - 38 * 86400000)),
      isExtra: false,
      note: 'Celebrated completing first gym week! 🎉',
      createdAt: new Date(now.getTime() - 38 * 86400000).toISOString(),
    },
    {
      id: 'red-2',
      treatId: 'treat-pastry',
      date: formatDateToISO(new Date(now.getTime() - 35 * 86400000)),
      isExtra: false,
      note: 'Almond croissant on Sunday morning 🥐',
      createdAt: new Date(now.getTime() - 35 * 86400000).toISOString(),
    },
    {
      id: 'red-3',
      treatId: 'treat-ramen',
      date: formatDateToISO(new Date(now.getTime() - 32 * 86400000)),
      isExtra: false,
      note: 'Tonkotsu Ramen with egg 🍜',
      createdAt: new Date(now.getTime() - 32 * 86400000).toISOString(),
    },
    // This month (recent)
    {
      id: 'red-4',
      treatId: 'treat-boba',
      date: formatDateToISO(new Date(now.getTime() - 8 * 86400000)),
      isExtra: false,
      note: 'Brown Sugar Pearl Milk Tea 🧋',
      createdAt: new Date(now.getTime() - 8 * 86400000).toISOString(),
    },
    {
      id: 'red-5',
      treatId: 'treat-pastry',
      date: formatDateToISO(new Date(now.getTime() - 4 * 86400000)),
      isExtra: false,
      note: 'Matcha roll cake after library day 🍵',
      createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    },
    // One extra treat logged honestly!
    {
      id: 'red-6',
      treatId: 'treat-boba',
      date: formatDateToISO(new Date(now.getTime() - 1 * 86400000)),
      isExtra: true,
      note: 'Friend bought me bubble tea on a rainy afternoon ☔',
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    },
  ];

  // Pre-generated unlocked achievements for Trophy Shelf
  const achievements: Achievement[] = [
    {
      id: 'ach-1',
      goalId: 'goal-gym',
      treatId: 'treat-boba',
      type: 'goal_achieved',
      periodKey: 'Previous Week',
      periodLabel: 'Last Week',
      title: 'Goal Smashed! Champion Energy! 🏆',
      message: 'Mission complete! You crushed your target of 3 workout check-ins! You also earned 1 treat along the way.',
      totalCheckIns: 3,
      target: 3,
      treatsEarned: 1,
      unlockedAt: new Date(now.getTime() - 9 * 86400000).toISOString(),
      goalName: 'Gym & Workout',
      goalEmoji: '🏋️',
      treatName: 'Bubble Tea',
      treatEmoji: '🧋',
    },
    {
      id: 'ach-2',
      goalId: 'goal-read',
      treatId: 'treat-pastry',
      type: 'milestone_50',
      periodKey: 'Monthly Goal',
      periodLabel: 'Reading Challenge',
      title: 'Halfway There & Glowing! 🌈',
      message: 'Milestone reached: 50% completed! Showing up 8 times takes real heart. Keep this cheerful vibe going!',
      totalCheckIns: 8,
      target: 15,
      treatsEarned: 2,
      unlockedAt: new Date(now.getTime() - 14 * 86400000).toISOString(),
      goalName: 'Read 30 Mins',
      goalEmoji: '📚',
      treatName: 'Weekend Pastry',
      treatEmoji: '🥐',
    },
    {
      id: 'ach-3',
      goalId: 'goal-cook',
      treatId: 'treat-ramen',
      type: 'goal_achieved',
      periodKey: 'Weekly Cooking',
      periodLabel: '2 Weeks Ago',
      title: 'Golden Star Moment! ⭐',
      message: 'Congratulations! You fulfilled 100% of your Cook Dinner at Home goal. Hard work done, rewards secured!',
      totalCheckIns: 4,
      target: 4,
      treatsEarned: 1,
      unlockedAt: new Date(now.getTime() - 16 * 86400000).toISOString(),
      goalName: 'Cook Dinner at Home',
      goalEmoji: '🍳',
      treatName: 'Japanese Ramen',
      treatEmoji: '🍜',
    },
  ];

  return {
    goals,
    treats,
    checkIns,
    redemptions,
    achievements,
  };
}
