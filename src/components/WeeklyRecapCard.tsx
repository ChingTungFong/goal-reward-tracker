import React, { useMemo } from 'react';
import { X, Sparkles, Calendar, CheckCircle2, Gift, Coffee, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDateToISO, getWeekDateRange } from '../utils/dateUtils';
import { getRandomTemplate } from '../utils/templates';

export const WeeklyRecapModal: React.FC = () => {
  const {
    isWeeklyRecapOpen,
    setIsWeeklyRecapOpen,
    checkIns,
    goals,
    redemptions,
    treats,
    lang,
  } = useApp();

  // Compute last week's date range
  const lastWeekData = useMemo(() => {
    const today = new Date();
    // Go to 7 days ago
    const lastWeekDay = new Date(today);
    lastWeekDay.setDate(today.getDate() - 7);
    const { start, end } = getWeekDateRange(lastWeekDay);

    const checkInsInLastWeek = checkIns.filter(
      (c) => c.date >= start && c.date <= end
    );

    // Goals achieved in last week (for weekly goals that reached target)
    let goalsAchieved = 0;
    goals.forEach((g) => {
      if (g.durationType === 'weekly') {
        const count = checkInsInLastWeek.filter((c) => c.goalId === g.id).length;
        if (count >= g.target) {
          goalsAchieved++;
        }
      }
    });

    // Treats earned in last week: calculate from each goal's checkins in that period
    let treatsEarned = 0;
    goals.forEach((g) => {
      if (g.rewardRule) {
        const count = checkInsInLastWeek.filter((c) => c.goalId === g.id).length;
        treatsEarned += Math.floor(count / g.rewardRule.checkInsRequired) * g.rewardRule.treatsEarned;
      }
    });

    // Treats redeemed in last week
    const treatsRedeemed = redemptions.filter(
      (r) => r.date >= start && r.date <= end
    ).length;

    const templateMsg = getRandomTemplate('weekly_recap', lang, {
      totalCheckIns: checkInsInLastWeek.length,
      goalsAchieved,
      treatsEarned,
      treatsRedeemed,
    });

    return {
      start,
      end,
      totalCheckIns: checkInsInLastWeek.length,
      goalsAchieved,
      treatsEarned,
      treatsRedeemed,
      message: templateMsg,
    };
  }, [checkIns, goals, redemptions, lang]);

  if (!isWeeklyRecapOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-amber-50/90 via-white to-white rounded-3xl p-5 shadow-2xl border border-amber-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '每週回顧卡' : 'Weekly Recap'}</span>
          </div>
          <button
            onClick={() => setIsWeeklyRecapOpen(false)}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Body */}
        <div className="my-2">
          <h3 className="font-display text-lg font-bold text-stone-900 mb-1">
            {lastWeekData.message.title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {lastWeekData.message.body}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-center">
            <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
              {lang === 'zh' ? '打卡次數' : 'Check-ins'}
            </span>
            <span className="font-display text-2xl font-bold text-stone-800 tabular-nums">
              {lastWeekData.totalCheckIns}
            </span>
          </div>

          <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100/60 text-center">
            <span className="text-[10px] text-emerald-600 font-semibold block uppercase tracking-wider">
              {lang === 'zh' ? '達標目標' : 'Goals Met'}
            </span>
            <span className="font-display text-2xl font-bold text-emerald-700 tabular-nums">
              {lastWeekData.goalsAchieved}
            </span>
          </div>

          <div className="bg-rose-50/60 rounded-2xl p-3 border border-rose-100/60 text-center">
            <span className="text-[10px] text-rose-500 font-semibold block uppercase tracking-wider">
              {lang === 'zh' ? '解鎖獎賞' : 'Earned Treats'}
            </span>
            <span className="font-display text-2xl font-bold text-rose-600 tabular-nums">
              +{lastWeekData.treatsEarned}
            </span>
          </div>

          <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-100/60 text-center">
            <span className="text-[10px] text-amber-600 font-semibold block uppercase tracking-wider">
              {lang === 'zh' ? '已享用享受' : 'Redeemed'}
            </span>
            <span className="font-display text-2xl font-bold text-amber-700 tabular-nums">
              {lastWeekData.treatsRedeemed}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsWeeklyRecapOpen(false)}
          className="w-full min-h-[44px] py-2.5 bg-stone-900 text-white font-medium text-xs rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all shadow-sm"
        >
          {lang === 'zh' ? '滿滿能量，迎接新一週！' : 'Ready For A Great New Week!'}
        </button>
      </div>
    </div>
  );
};
