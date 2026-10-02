import React, { useMemo } from 'react';
import {
  CheckCircle2,
  Undo2,
  Gift,
  Plus,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getTodayDateString,
  getPeriodDateRange,
  getPeriodLabel,
  formatFriendlyDate,
} from '../utils/dateUtils';

interface TodayViewProps {
  onOpenCreateGoal: () => void;
  onOpenRedeemModal: (treatId: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  onOpenCreateGoal,
  onOpenRedeemModal,
}) => {
  const {
    goals,
    treats,
    checkIns,
    lang,
    toggleCheckInToday,
    isGoalCheckedInOnDate,
    getTreatStats,
    setIsWeeklyRecapOpen,
    setActiveTab,
  } = useApp();

  const todayStr = getTodayDateString();
  const todayDate = new Date();

  // Active (non-archived) goals
  const activeGoals = useMemo(() => {
    return goals.filter((g) => !g.isArchived);
  }, [goals]);

  // Today's check-in summary
  const todayCheckInsCount = useMemo(() => {
    return activeGoals.filter((g) => isGoalCheckedInOnDate(g.id, todayStr)).length;
  }, [activeGoals, isGoalCheckedInOnDate, todayStr]);

  // Treats ready to enjoy today
  const treatsWithBalance = useMemo(() => {
    return treats
      .map((t) => ({
        treat: t,
        stats: getTreatStats(t.id),
      }))
      .filter((item) => item.stats.availableToRedeem > 0);
  }, [treats, getTreatStats]);

  // Friendly date display
  const dateHeading = useMemo(() => {
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysZh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayOfWeek = todayDate.getDay();
    const formatted = formatFriendlyDate(todayStr, lang);
    return {
      date: formatted,
      weekday: lang === 'zh' ? daysZh[dayOfWeek] : daysEn[dayOfWeek],
    };
  }, [todayDate, todayStr, lang]);

  return (
    <div className="space-y-5 pb-6">
      {/* Date Header & Today Counter */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">
            {dateHeading.weekday}
          </span>
          <h2 className="font-display text-2xl font-bold text-stone-900 leading-tight">
            {dateHeading.date}
          </h2>
        </div>

        {activeGoals.length > 0 && (
          <div className="text-right">
            <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
              {lang === 'zh' ? '今日完成' : 'Done Today'}
            </span>
            <span className="font-display text-xl font-bold text-stone-800 tabular-nums">
              {todayCheckInsCount}
              <span className="text-sm font-medium text-stone-400">/{activeGoals.length}</span>
            </span>
          </div>
        )}
      </div>

      {/* Weekly Recap Prompt Banner */}
      <div
        onClick={() => setIsWeeklyRecapOpen(true)}
        className="bg-gradient-to-r from-amber-50 via-rose-50/60 to-orange-50 p-3.5 rounded-2xl border border-amber-200/60 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display text-xs font-bold text-stone-900">
              {lang === 'zh' ? '查看上週成績小報 💌' : 'View Weekly Report 💌'}
            </h4>
            <p className="text-[11px] text-stone-500 line-clamp-1">
              {lang === 'zh'
                ? '回顧一週打卡、達標次數與解鎖的享受'
                : 'Recap check-ins, targets achieved, and treats redeemed'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
      </div>

      {/* Quick Treat Bank Carousel (if any treats available) */}
      {treatsWithBalance.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5 text-rose-500" />
              <span>{lang === 'zh' ? '隨時可享受的獎賞' : 'Ready to Redeem'}</span>
            </h3>
            <button
              onClick={() => setActiveTab('treats')}
              className="text-[11px] font-semibold text-rose-500 hover:text-rose-600"
            >
              {lang === 'zh' ? '查看全部' : 'View all'} →
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
            {treatsWithBalance.map(({ treat, stats }) => (
              <div
                key={treat.id}
                className="bg-white border border-stone-200/80 rounded-2xl p-3 shrink-0 w-44 flex flex-col justify-between shadow-xs hover:border-rose-200 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{treat.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {treat.name}
                    </h4>
                    <span className="text-[11px] text-rose-500 font-semibold tabular-nums block">
                      {lang === 'zh'
                        ? `剩餘 ${stats.availableToRedeem} 次`
                        : `${stats.availableToRedeem} available`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenRedeemModal(treat.id)}
                  className="w-full min-h-[36px] py-1.5 px-2 bg-rose-500 text-white text-xs font-semibold rounded-xl hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  <Gift className="w-3 h-3" />
                  <span>{lang === 'zh' ? '立即兌換' : 'Redeem'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Checklist for Today */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'zh' ? '今日好習慣' : "Today's Check-ins"}</span>
          </h3>
          <button
            onClick={onOpenCreateGoal}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '新增目標' : 'New Goal'}</span>
          </button>
        </div>

        {activeGoals.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-200 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-3xl mb-3">
              🌱
            </div>
            <h4 className="font-display text-sm font-bold text-stone-800">
              {lang === 'zh' ? '建立你的第一個好習慣' : 'Set your first goal!'}
            </h4>
            <p className="text-xs text-stone-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
              {lang === 'zh'
                ? '設定一個目標（例如每週去 3 次健身），並為它挑選一份專屬獎勵！'
                : 'Set a goal (e.g. 3 workouts/week) and pair it with a reward like bubble tea or ramen!'}
            </p>
            <button
              onClick={onOpenCreateGoal}
              className="mt-4 px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'zh' ? '立即新增' : 'Add First Goal'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeGoals.map((goal) => {
              const isCheckedIn = isGoalCheckedInOnDate(goal.id, todayStr);
              const linkedTreat = goal.rewardRule ? treats.find((t) => t.id === goal.rewardRule?.treatId) : undefined;

              // Calculate period progress
              const { start, end } = getPeriodDateRange(todayDate, goal.durationType);
              const periodCheckIns = checkIns.filter(
                (c) => c.goalId === goal.id && c.date >= start && c.date <= end
              );
              const periodCount = periodCheckIns.length;
              const isTargetReached = periodCount >= goal.target;
              const periodLabel = getPeriodLabel(
                todayStr.slice(0, 7),
                goal.durationType,
                lang
              );

              // Calculate progress toward next treat in this month
              const monthStr = todayStr.slice(0, 7);
              const monthCheckIns = checkIns.filter(
                (c) => c.goalId === goal.id && c.date.startsWith(monthStr)
              );
              const progressInCycle = goal.rewardRule
                ? monthCheckIns.length % goal.rewardRule.checkInsRequired
                : 0;

              return (
                <div
                  key={goal.id}
                  className={`bg-white rounded-2xl p-4 border transition-all ${
                    isCheckedIn
                      ? 'border-emerald-200/80 bg-emerald-50/20 shadow-xs'
                      : 'border-stone-200/80 shadow-xs hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Emoji & Info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl shrink-0">
                        {goal.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-display text-sm font-bold text-stone-900 truncate">
                            {goal.name}
                          </h4>
                          {isTargetReached && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200/60 inline-flex items-center gap-0.5">
                              <Award className="w-3 h-3" />
                              <span>{lang === 'zh' ? '已達標' : 'Achieved'}</span>
                            </span>
                          )}
                        </div>

                        {/* Period target progress */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                          <span>
                            {lang === 'zh' ? '本期進度' : 'Period'}:{' '}
                            <strong className="text-stone-800 font-bold tabular-nums">
                              {periodCount}/{goal.target}
                            </strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">
                            {goal.durationType === 'weekly'
                              ? lang === 'zh'
                                ? '每週'
                                : 'Weekly'
                              : goal.durationType === 'monthly'
                              ? lang === 'zh'
                                ? '每月'
                                : 'Monthly'
                              : lang === 'zh'
                              ? '每年'
                              : 'Yearly'}
                          </span>
                        </div>

                        {/* Reward rule progress hint */}
                        {linkedTreat && goal.rewardRule && (
                          <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1 bg-stone-50/80 rounded-lg px-2 py-1 border border-stone-100/60">
                            <Gift className="w-3 h-3 text-rose-500 shrink-0" />
                            <span>
                              {lang === 'zh'
                                ? `每 ${goal.rewardRule.checkInsRequired} 次打卡 = 1 份 ${linkedTreat.emoji}${linkedTreat.name}`
                                : `Every ${goal.rewardRule.checkInsRequired} check-ins = 1 ${linkedTreat.emoji} ${linkedTreat.name}`}
                            </span>
                            <span className="text-rose-600 font-bold tabular-nums ml-auto">
                              ({progressInCycle}/{goal.rewardRule.checkInsRequired})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: 1-Tap Check-in Action */}
                    <div className="shrink-0 flex flex-col items-end">
                      <button
                        onClick={() => toggleCheckInToday(goal.id)}
                        className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                          isCheckedIn
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
                            : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98]'
                        }`}
                        title={
                          isCheckedIn
                            ? lang === 'zh'
                              ? '點擊還原今日打卡'
                              : 'Tap to undo today check-in'
                            : lang === 'zh'
                            ? '打卡'
                            : 'Check in'
                        }
                      >
                        {isCheckedIn ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                            <span>{lang === 'zh' ? '已完成' : 'Done'}</span>
                          </>
                        ) : (
                          <>
                            <span>{lang === 'zh' ? '打卡' : 'Check in'}</span>
                          </>
                        )}
                      </button>

                      {isCheckedIn && (
                        <button
                          onClick={() => toggleCheckInToday(goal.id)}
                          className="mt-1 text-[10px] text-stone-400 hover:text-rose-500 flex items-center gap-0.5"
                        >
                          <Undo2 className="w-2.5 h-2.5" />
                          <span>{lang === 'zh' ? '取消打卡' : 'Undo'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gentle Bottom Encouragement */}
      <div className="text-center py-2">
        <p className="text-[11px] text-stone-400 leading-normal">
          {lang === 'zh'
            ? '忘記了打卡？可在「月曆」標籤補回過去 7 天的紀錄 📅'
            : 'Forgot to check in? You can backfill past 7 days in the Calendar tab 📅'}
        </p>
      </div>
    </div>
  );
};
