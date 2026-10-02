import { DurationType, Language } from '../types';

export interface PresetGoal {
  name: { en: string; zh: string };
  emoji: string;
  durationType: DurationType;
  target: number;
  rewardRule: {
    checkInsRequired: number;
    treatsEarned: number;
    defaultTreatName: { en: string; zh: string };
    defaultTreatEmoji: string;
    defaultMonthlyCap: number;
  };
}

export const PRESET_GOALS: PresetGoal[] = [
  {
    name: { en: 'Gym & Workout', zh: '健身運動' },
    emoji: '🏋️',
    durationType: 'weekly',
    target: 3,
    rewardRule: {
      checkInsRequired: 3,
      treatsEarned: 1,
      defaultTreatName: { en: 'Bubble Tea', zh: '珍珠奶茶' },
      defaultTreatEmoji: '🧋',
      defaultMonthlyCap: 4,
    },
  },
  {
    name: { en: 'Read 30 Minutes', zh: '每天閱讀半小時' },
    emoji: '📚',
    durationType: 'monthly',
    target: 15,
    rewardRule: {
      checkInsRequired: 5,
      treatsEarned: 1,
      defaultTreatName: { en: 'Buy a New Book', zh: '買一本新書' },
      defaultTreatEmoji: '📖',
      defaultMonthlyCap: 3,
    },
  },
  {
    name: { en: 'Cook Dinner at Home', zh: '自己煮健康晚餐' },
    emoji: '🍳',
    durationType: 'weekly',
    target: 4,
    rewardRule: {
      checkInsRequired: 4,
      treatsEarned: 1,
      defaultTreatName: { en: 'Nice Restaurant Dinner', zh: '精緻餐廳外食' },
      defaultTreatEmoji: '🍽️',
      defaultMonthlyCap: 4,
    },
  },
  {
    name: { en: 'Drink 2L Water Daily', zh: '飲夠 8 杯水' },
    emoji: '💧',
    durationType: 'weekly',
    target: 7,
    rewardRule: {
      checkInsRequired: 7,
      treatsEarned: 1,
      defaultTreatName: { en: 'Artisan Latte', zh: '精品手沖咖啡' },
      defaultTreatEmoji: '☕',
      defaultMonthlyCap: 5,
    },
  },
  {
    name: { en: 'Go to Sleep Before Midnight', zh: '12 點前早睡' },
    emoji: '🌙',
    durationType: 'weekly',
    target: 5,
    rewardRule: {
      checkInsRequired: 5,
      treatsEarned: 1,
      defaultTreatName: { en: 'Guilt-Free Dessert', zh: '美味甜品' },
      defaultTreatEmoji: '🍰',
      defaultMonthlyCap: 4,
    },
  },
  {
    name: { en: '10,000 Steps Daily', zh: '日行一萬步' },
    emoji: '👟',
    durationType: 'weekly',
    target: 5,
    rewardRule: {
      checkInsRequired: 5,
      treatsEarned: 1,
      defaultTreatName: { en: 'Movie Night Ticket', zh: '睇一齣電影' },
      defaultTreatEmoji: '🎬',
      defaultMonthlyCap: 3,
    },
  },
  {
    name: { en: 'Annual Language Study', zh: '外語學習挑戰' },
    emoji: '🗣️',
    durationType: 'yearly',
    target: 120,
    rewardRule: {
      checkInsRequired: 10,
      treatsEarned: 1,
      defaultTreatName: { en: 'Online Shopping Treat', zh: '網購心願清單一件' },
      defaultTreatEmoji: '🛍️',
      defaultMonthlyCap: 2,
    },
  },
];

export const PRESET_TREATS = [
  { name: { en: 'Bubble Tea', zh: '珍珠奶茶' }, emoji: '🧋', monthlyCap: 4 },
  { name: { en: 'Matcha Dessert', zh: '抹茶甜品' }, emoji: '🍵', monthlyCap: 4 },
  { name: { en: 'Gourmet Ramen', zh: '日式拉麵' }, emoji: '🍜', monthlyCap: 3 },
  { name: { en: 'Bakery Pastry', zh: '酥脆牛角包' }, emoji: '🥐', monthlyCap: 6 },
  { name: { en: 'Cinema Movie', zh: '戲院睇戲' }, emoji: '🎬', monthlyCap: 2 },
  { name: { en: 'Online Shopping Splurge', zh: '網購小心願' }, emoji: '🛍️', monthlyCap: 2 },
  { name: { en: 'Spa & Massage', zh: '按摩放鬆' }, emoji: '💆', monthlyCap: 1 },
];
