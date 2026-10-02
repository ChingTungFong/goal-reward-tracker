import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar as CalendarIcon,
  Sparkles,
  History,
  AlertCircle,
  Plus,
  Trash2,
  X,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  formatDateToISO,
  parseISODate,
  getTodayDateString,
  isDateWithinBackfillRange,
  formatFriendlyDate,
  getPeriodDateRange,
  getPeriodLabel,
} from '../utils/dateUtils';
import { Goal, CheckIn, Redemption } from '../types';

export const CalendarView: React.FC = () => {
  const {
    goals,
    treats,
    checkIns,
    redemptions,
    lang,
    addBackfillCheckIn,
    removeCheckIn,
    isGoalCheckedInOnDate,
    getCheckInForGoalOnDate,
  } = useApp();

  const todayStr = getTodayDateString();

  // Selected viewing month (default current month)
  const [viewDate, setViewDate] = useState(() => new Date());
  // Filter by goal (null for all goals)
  const [selectedGoalId, setSelectedGoalId] = useState<string>('all');
  // Selected day for bottom sheet inspection & backfill
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const monthNamesZh = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleJumpToToday = () => {
    setViewDate(new Date());
    setSelectedDayStr(todayStr);
  };

  // Calendar cells generation (Mon to Sun week layout)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const totalDays = lastDayOfMonth.getDate();
    // getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
    // Convert to Monday=0 ... Sunday=6
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isFuture: boolean;
      isWithinBackfill: boolean;
    }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, d);
      const dStr = formatDateToISO(prevDate);
      days.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isFuture: dStr > todayStr,
        isWithinBackfill: isDateWithinBackfillRange(dStr),
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const curDate = new Date(year, month, d);
      const dStr = formatDateToISO(curDate);
      days.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        isFuture: dStr > todayStr,
        isWithinBackfill: isDateWithinBackfillRange(dStr),
      });
    }

    // Next month padding to make full 7-day rows
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dStr = formatDateToISO(nextDate);
      days.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isFuture: dStr > todayStr,
        isWithinBackfill: false,
      });
    }

    return days;
  }, [year, month, todayStr]);

  // Filtered checkins
  const relevantCheckIns = useMemo(() => {
    return checkIns.filter((c) => {
      if (selectedGoalId === 'all') return true;
      return c.goalId === selectedGoalId;
    });
  }, [checkIns, selectedGoalId]);

  // Redemptions in this month
  const relevantRedemptions = useMemo(() => {
    return redemptions;
  }, [redemptions]);

  // Active goals list
  const activeGoals = useMemo(() => {
    return goals.filter((g) => !g.isArchived);
  }, [goals]);

  // Selected day items for modal
  const dayDetails = useMemo(() => {
    if (!selectedDayStr) return null;

    const dayCheckIns = checkIns.filter((c) => c.date === selectedDayStr);
    const dayRedemptions = redemptions.filter((r) => r.date === selectedDayStr);
    const isBackfillAllowed = isDateWithinBackfillRange(selectedDayStr);
    const isFuture = selectedDayStr > todayStr;

    return {
      dateStr: selectedDayStr,
      formattedDate: formatFriendlyDate(selectedDayStr, lang),
      checkIns: dayCheckIns,
      redemptions: dayRedemptions,
      isBackfillAllowed,
      isFuture,
    };
  }, [selectedDayStr, checkIns, redemptions, todayStr, lang]);

  // Period achievements overview for the selected month / active goals
  const periodResults = useMemo(() => {
    if (selectedGoalId === 'all') return [];

    const targetGoal = goals.find((g) => g.id === selectedGoalId);
    if (!targetGoal) return [];

    const { start, end } = getPeriodDateRange(viewDate, targetGoal.durationType);
    const count = checkIns.filter(
      (c) => c.goalId === targetGoal.id && c.date >= start && c.date <= end
    ).length;

    const isAchieved = count >= targetGoal.target;
    const periodLabel = getPeriodLabel(monthStr, targetGoal.durationType, lang);

    return [
      {
        goal: targetGoal,
        periodLabel,
        count,
        target: targetGoal.target,
        isAchieved,
      },
    ];
  }, [selectedGoalId, goals, viewDate, monthStr, checkIns, lang]);

  return (
    <div className="space-y-4 pb-8">
      {/* Month Navigation & Today Shortcut */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors shadow-xs"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="font-display text-lg font-bold text-stone-900 leading-tight">
              {lang === 'zh'
                ? `${year} 年 ${monthNamesZh[month]}`
                : `${monthNamesEn[month]} ${year}`}
            </h2>
          </div>

          <button
            onClick={handleNextMonth}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors shadow-xs"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleJumpToToday}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50/60 transition-colors"
        >
          {lang === 'zh' ? '回到今日' : 'Today'}
        </button>
      </div>

      {/* Goal Filter (Segmented Pills / Dropdown) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedGoalId('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors min-h-[38px] ${
            selectedGoalId === 'all'
              ? 'bg-stone-900 text-white font-semibold shadow-xs'
              : 'bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900'
          }`}
        >
          {lang === 'zh' ? '全部目標' : 'All Goals'}
        </button>

        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGoalId(g.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 min-h-[38px] ${
              selectedGoalId === g.id
                ? 'bg-rose-500 text-white font-semibold shadow-xs'
                : 'bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{g.emoji}</span>
            <span className="truncate max-w-[120px]">{g.name}</span>
          </button>
        ))}
      </div>

      {/* Period Result Banner if specific goal filtered */}
      {periodResults.length > 0 && (
        <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{periodResults[0].goal.emoji}</span>
            <div>
              <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
                {periodResults[0].periodLabel}
              </span>
              <h4 className="font-display text-xs font-bold text-stone-800">
                {lang === 'zh' ? '本期打卡進度' : 'Period Progress'}: {periodResults[0].count} / {periodResults[0].target}
              </h4>
            </div>
          </div>
          <div>
            {periodResults[0].isAchieved ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>{lang === 'zh' ? '已圓滿達成 🎉' : 'Achieved 🎉'}</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                {lang === 'zh' ? '持續努力中' : 'In Progress'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-3xl p-3 border border-stone-200/80 shadow-xs">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
            <div
              key={idx}
              className={`text-[11px] font-semibold py-1 ${
                idx >= 5 ? 'text-rose-400' : 'text-stone-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            // Find checkins on this day matching the filter
            const dayCheckIns = relevantCheckIns.filter((c) => c.date === day.dateStr);
            const hasCheckIn = dayCheckIns.length > 0;
            const hasBackfill = dayCheckIns.some((c) => c.isBackfill);

            // Find redemptions on this day
            const dayRedemptions = relevantRedemptions.filter((r) => r.date === day.dateStr);
            const hasRedemption = dayRedemptions.length > 0;

            const isSelected = selectedDayStr === day.dateStr;

            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDayStr(day.dateStr)}
                className={`relative min-h-[50px] p-1 rounded-xl flex flex-col items-center justify-between transition-all ${
                  !day.isCurrentMonth
                    ? 'opacity-30'
                    : day.isFuture
                    ? 'opacity-50'
                    : 'opacity-100'
                } ${
                  isSelected
                    ? 'ring-2 ring-rose-500 bg-rose-50/50'
                    : day.isToday
                    ? 'bg-amber-50/80 border border-amber-200/80'
                    : 'hover:bg-stone-50'
                }`}
              >
                {/* Day number */}
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
                    day.isToday
                      ? 'text-amber-800 font-bold'
                      : day.isCurrentMonth
                      ? 'text-stone-800'
                      : 'text-stone-400'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Day Status Indicators */}
                <div className="flex flex-col items-center gap-0.5 my-0.5">
                  {/* Treat redemption emoji */}
                  {hasRedemption && (
                    <span className="text-[10px] leading-none" title="Treat redeemed">
                      {treats.find((t) => t.id === dayRedemptions[0].treatId)?.emoji || '🎁'}
                    </span>
                  )}

                  {/* Check-in Indicator: Cheerful dot, with backfill badge or quiet missed dot */}
                  {hasCheckIn ? (
                    <div className="flex items-center gap-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          hasBackfill ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        title={hasBackfill ? 'Backfilled check-in' : 'Checked-in'}
                      />
                      {hasBackfill && (
                        <span className="text-[8px] text-amber-600 font-bold" title="Backfill">
                          ⏳
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Encouraging soft grey dot for passed days with no activity */
                    !day.isFuture &&
                    day.isCurrentMonth && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-stone-200"
                        title="Rest day"
                      />
                    )
                  )}
                </div>

                {/* Today tiny dot marker */}
                {day.isToday ? (
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                ) : (
                  <span className="w-1 h-1 opacity-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 flex-wrap gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{lang === 'zh' ? '已打卡' : 'Check-in'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[9px]">⏳</span>
            <span>{lang === 'zh' ? '後補打卡' : 'Backfilled'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span>{lang === 'zh' ? '休息日' : 'Rest day'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🧋</span>
            <span>{lang === 'zh' ? '享受獎賞' : 'Redemption'}</span>
          </div>
        </div>
      </div>

      {/* Selected Day Inspection & Backfill Modal / Sheet */}
      {dayDetails && (
        <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-md animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-rose-500" />
              <h3 className="font-display text-sm font-bold text-stone-900">
                {dayDetails.formattedDate} ({dayDetails.dateStr})
              </h3>
            </div>
            <button
              onClick={() => setSelectedDayStr(null)}
              className="text-stone-400 hover:text-stone-700 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-3">
            {/* Redemptions on this date */}
            {dayDetails.redemptions.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                  {lang === 'zh' ? '這天享用的獎賞' : 'Treats Enjoyed'}
                </span>
                <div className="space-y-1.5">
                  {dayDetails.redemptions.map((r) => {
                    const treat = treats.find((t) => t.id === r.treatId);
                    return (
                      <div
                        key={r.id}
                        className="bg-amber-50/70 border border-amber-200/60 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{treat?.emoji || '🎁'}</span>
                          <div>
                            <span className="font-bold text-stone-900">
                              {treat?.name}
                            </span>
                            {r.isExtra && (
                              <span className="ml-1.5 text-[10px] text-coral-600 bg-rose-100/70 px-1.5 py-0.2 rounded font-semibold">
                                {lang === 'zh' ? '外加享受' : 'Extra Treat'}
                              </span>
                            )}
                            {r.note && (
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                {r.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Check-ins on this date & Backfill Actions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  {lang === 'zh' ? '目標打卡情況' : 'Habit Check-ins'}
                </span>
                {dayDetails.isBackfillAllowed && (
                  <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                    <History className="w-3 h-3" />
                    <span>{lang === 'zh' ? '支援 7 天內後補' : 'Past 7 days backfill available'}</span>
                  </span>
                )}
              </div>

              {dayDetails.isFuture ? (
                <div className="bg-stone-50 rounded-xl p-3 text-center text-xs text-stone-400">
                  {lang === 'zh' ? '未來的日子不可預先打卡哦 ✨' : 'Future dates cannot be checked in yet ✨'}
                </div>
              ) : (
                <div className="space-y-2">
                  {activeGoals.map((goal) => {
                    const checkInRecord = getCheckInForGoalOnDate(goal.id, dayDetails.dateStr);
                    const isChecked = !!checkInRecord;

                    return (
                      <div
                        key={goal.id}
                        className={`rounded-xl p-2.5 border flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-emerald-50/40 border-emerald-200/80'
                            : 'bg-stone-50/50 border-stone-200/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{goal.emoji}</span>
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">
                              {goal.name}
                            </h4>
                            {checkInRecord?.isBackfill && (
                              <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                                <span>⏳</span>
                                <span>{lang === 'zh' ? '後補紀錄' : 'Backfilled entry'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {isChecked ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mr-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{lang === 'zh' ? '已打卡' : 'Checked'}</span>
                            </span>
                            {/* Allow deleting check-in if within backfill range or today */}
                            {(dayDetails.isBackfillAllowed || dayDetails.dateStr === todayStr) && (
                              <button
                                onClick={() => removeCheckIn(checkInRecord.id)}
                                className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-rose-500 rounded-lg hover:bg-white"
                                title={lang === 'zh' ? '取消此打卡' : 'Remove check-in'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : dayDetails.isBackfillAllowed ? (
                          <button
                            onClick={() => addBackfillCheckIn(goal.id, dayDetails.dateStr)}
                            className="min-h-[36px] px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>
                              {dayDetails.dateStr === todayStr
                                ? lang === 'zh'
                                  ? '今日打卡'
                                  : 'Check in'
                                : lang === 'zh'
                                ? '後補打卡 ⏳'
                                : 'Backfill ⏳'}
                            </span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400">
                            {lang === 'zh' ? '未打卡（超過 7 天）' : 'Missed (> 7 days)'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Backfill policy note */}
            {!dayDetails.isBackfillAllowed && !dayDetails.isFuture && (
              <div className="p-2 bg-stone-50 rounded-xl text-[11px] text-stone-400 leading-normal flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
                <span>
                  {lang === 'zh'
                    ? '為了保持真實與新鮮感，後補打卡僅限過去 7 天內補回。'
                    : 'Backfilling is limited to the past 7 days to keep habits fresh and authentic.'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
